package org.trichter.backend.infrastructure.storage.azure

import com.azure.storage.blob.BlobContainerClient
import com.azure.storage.blob.BlobServiceClient
import com.azure.storage.blob.models.BlobHttpHeaders
import com.azure.storage.blob.sas.BlobSasPermission
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.trichter.backend.runs.storage.ImageRef
import org.trichter.backend.runs.storage.ImageStorage
import org.trichter.backend.runs.storage.SignedImageUrl
import org.trichter.backend.runs.storage.StoredImage
import org.trichter.backend.runs.storage.into
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.time.Duration
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.util.UUID

@Component
class AzureBlobImageStorage(
    private val blobServiceClient: BlobServiceClient,
    private val properties: AzureStorageProperties
): ImageStorage {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun putRunImage(
        runId: UUID,
        bytes: ByteArray,
        contentType: String,
    ): ImageRef {
        log.info("Storing image for run $runId...");
        val containerClient = containerClient();

        val key = buildRunImageKey(runId, contentType)
        val blobClient = containerClient.getBlobClient(key);

        ByteArrayInputStream(bytes).use { input ->
            blobClient.upload(input, bytes.size.toLong(), false)
        }

        blobClient.setHttpHeaders(
            BlobHttpHeaders().setContentType(contentType)
        )

        log.info("Successfully stored image for run $runId")
        return key.into()
    }

    override fun get(imageRef: ImageRef): StoredImage? {
        val blobClient = containerClient().getBlobClient(imageRef.into())
        if(!blobClient.exists()) {
            log.warn("Could not find image for $imageRef")
            return null
        }

        //TODO: Directly stream to client?
        val output = ByteArrayOutputStream()
        blobClient.downloadStream(output)

        val blobProperties = blobClient.properties;

        return StoredImage(
            ref = imageRef,
            contentType = blobProperties.contentType ?: "application/octet-stream",
            bytes = output.toByteArray()
        )

    }

    override fun generateSignedUrl(imageRef: ImageRef, ttl: Duration) : SignedImageUrl {
        val blobClient = containerClient().getBlobClient(imageRef.into())

        val expiresAt = Instant.now().plus(ttl)
        val sasValues = BlobServiceSasSignatureValues(
            OffsetDateTime.ofInstant(expiresAt, ZoneOffset.UTC),
            BlobSasPermission().setReadPermission(true)
        )

        val sasToken = blobClient.generateSas(sasValues)
        val url = "${blobClient.blobUrl}?$sasToken"

        return SignedImageUrl(
            imageRef = imageRef,
            url = url,
            expiresAt = expiresAt,
        )
    }

    override fun delete(imageRef: ImageRef) {
        log.info("Deleting image $imageRef")
        containerClient()
            .getBlobClient(imageRef.into())
            .deleteIfExists()
    }

    private fun containerClient(): BlobContainerClient {
        val containerClient = blobServiceClient.getBlobContainerClient(properties.containerName)
        if(!containerClient.exists()) {
            containerClient.create()
        }
        return containerClient
    }


    private fun buildRunImageKey(runId: UUID, contentType: String): String {
        val extension = when(contentType.lowercase()) {
            "image/jpeg" -> ".jpg"
            "image/png" -> ".png"
            "image/webp" -> ".webp"
            else -> ""
        }

        return "${properties.keyPrefix}/$runId/image$extension"
    }
}