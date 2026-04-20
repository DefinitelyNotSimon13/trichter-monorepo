import org.jetbrains.compose.desktop.application.dsl.TargetFormat
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import java.util.Properties

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.openapiGenerator)
}

val appVersionMajor = 1
val appVersionMinor = 0
val appVersionPatch = 0

val suffixVersion: Int = 2

val appVersionName = "$appVersionMajor.$appVersionMinor.$appVersionPatch"
val appVersionCode = appVersionMajor * 1000000 + appVersionMinor * 10000 + appVersionPatch * 100 + suffixVersion

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }

    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "ComposeApp"
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(project(":api-client"))
            implementation(libs.compose.runtime)
            implementation(libs.compose.foundation)
            implementation(libs.compose.material3)
            implementation(libs.material.icons.extended)
            implementation(libs.compose.ui)
            implementation(libs.compose.components.resources)
            implementation(libs.compose.uiToolingPreview)
            implementation(libs.androidx.lifecycle.viewmodelCompose)
            implementation(libs.androidx.lifecycle.runtimeCompose)

            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.ktor.client.logging)
            implementation(libs.ktor.client.websockets)

            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.kotlinx.datetime)

            api(libs.koin.core)
            implementation(libs.koin.compose)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.koin.ktor)
//            implementation(libs.lifecycle.viewmodel)
            implementation(libs.navigation.compose)

            implementation(libs.coil)
            implementation(libs.coil.network)

            implementation(libs.oidc.appsupport)
            implementation(libs.oidc.ktor)


            implementation(libs.kable)

            api(libs.datastore)
            api(libs.datastore.preferences)

            api(libs.moko.permissions)
            api(libs.moko.permissions.bluetooth)
            api(libs.moko.permissions.location)
            api(libs.moko.permissions.notifications)
            api(libs.moko.permissions.compose)

            implementation(libs.kotlinx.collections.immutable)

            implementation(libs.human.readable)

        }
        androidMain.dependencies {
            implementation(libs.compose.uiToolingPreview)
            implementation(libs.androidx.activity.compose)
            implementation(libs.kotlinx.coroutines.android)
            implementation(libs.ktor.client.android)
            implementation(libs.koin.android)
            implementation(libs.koin.androidx.compose)
            implementation(libs.kable.permissions)
            implementation(libs.androidx.core.splashscreen)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }

        commonTest.dependencies {
            implementation(libs.kotlin.test)
        }
    }
}

val keystorePropertiesFile = rootProject.file("keystore.properties")
val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) {
        load(keystorePropertiesFile.inputStream())
    }
}

val hasReleaseKeystore =
    keystorePropertiesFile.exists() &&
            !keystoreProperties.getProperty("storeFile").isNullOrBlank() &&
            !keystoreProperties.getProperty("storePassword").isNullOrBlank() &&
            !keystoreProperties.getProperty("keyAlias").isNullOrBlank() &&
            !keystoreProperties.getProperty("keyPassword").isNullOrBlank()

android {
    namespace = "org.trichter.app"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    buildFeatures {
        buildConfig = true
        viewBinding = true
    }

    defaultConfig {
        applicationId = "org.trichter.app"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()

        versionCode = appVersionCode
        versionName = appVersionName

        manifestPlaceholders["oidcRedirectScheme"] = "trichter"
    }

    signingConfigs {
        getByName("debug") {
        }

        if (hasReleaseKeystore) {
            create("release") {
                storeFile = rootProject.file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    flavorDimensions += "env"
    flavorDimensions += "type"
    productFlavors {
        create("local") {
            dimension = "env"
            buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:8080\"")
        }
        create("prod") {
            dimension = "env"
            buildConfigField("String", "BASE_URL", "\"https://next.trichter.hauptspeicher.com\"")
        }
        create("dev") {
            dimension = "type"
            applicationIdSuffix = ".dev"
            versionNameSuffix = "-dev"
        }
        create("alpha") {
            dimension = "type"
            versionNameSuffix = "-alpha.$suffixVersion"
        }
        create("beta") {
            dimension = "type"
            versionNameSuffix = "-beta.$suffixVersion"
        }
        create("default") {
            dimension = "type"
        }
    }

    buildTypes {
        getByName("debug") {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }

        getByName("release") {
            isMinifyEnabled = false

            if (hasReleaseKeystore) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    debugImplementation(libs.compose.uiTooling)
}

val generatedDir = rootProject.file("api-client/generated")

openApiGenerate {
    generatorName.set("kotlin")
    inputSpec.set(rootProject.file("api-client/openapi.yaml").path)
    outputDir.set(generatedDir.path)
    packageName.set("org.trichter.api.client")

    library.set("multiplatform")

    configOptions.set(
        mapOf(
            "companionObject" to "true",
            "groupId" to "org.trichter.app",
            "dateLibrary" to "kotlinx-datetime",
            "omitGradleWrapper" to "true",
            "omitGradlePluginVersions" to "true",
        )
    )
}
val rewriteGeneratedBuildScript by tasks.registering {
    dependsOn(tasks.named("openApiGenerate"))

    doLast {
        val file = layout.buildDirectory.file("generated/openapi/build.gradle.kts").get().asFile
        if (file.exists()) {
            file.writeText(
                file.readText()
                    .replace("""kotlin("multiplatform")""", """alias(libs.plugins.kotlinMultiplatform)""")
                    .replace("""kotlin("plugin.serialization")""", """alias(libs.plugins.kotlinSerialization)""")
            )
        }
    }
}