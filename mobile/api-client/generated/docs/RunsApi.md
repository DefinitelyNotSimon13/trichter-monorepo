# RunsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createRun**](RunsApi.md#createRun) | **POST** /api/v2/runs | Create a new run |
| [**deleteRun**](RunsApi.md#deleteRun) | **DELETE** /api/v2/runs/{id} | Delete a run |
| [**getRun**](RunsApi.md#getRun) | **GET** /api/v2/runs/{id} | Get run by ID |
| [**getRunImage**](RunsApi.md#getRunImage) | **GET** /api/v2/runs/{id}/image | Download run image |
| [**getRunImageSignedUrl**](RunsApi.md#getRunImageSignedUrl) | **GET** /api/v2/runs/{id}/image/signed-url | Get signed image URL |
| [**getRuns**](RunsApi.md#getRuns) | **GET** /api/v2/runs | List runs |
| [**getRunsByUser**](RunsApi.md#getRunsByUser) | **GET** /api/v2/users/{userId}/runs | List runs by user |
| [**updateRunUser**](RunsApi.md#updateRunUser) | **PUT** /api/v2/runs/{id}/user | Update assigned user of a run |
| [**uploadRunImage**](RunsApi.md#uploadRunImage) | **PUT** /api/v2/runs/{id}/image | Upload run image |


<a id="createRun"></a>
# **createRun**
> RunDto createRun(createRunRequest, xTrichterDeviceToken)

Create a new run

Creates a run entry without an image. The authenticated user becomes the creator (createdBy).

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val createRunRequest : CreateRunRequest = {"userId":"user-123","rate":5.5,"volume":1.4,"duration":1000} // CreateRunRequest | Run creation payload
val xTrichterDeviceToken : kotlin.String = xTrichterDeviceToken_example // kotlin.String | 
try {
    val result : RunDto = apiInstance.createRun(createRunRequest, xTrichterDeviceToken)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#createRun")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#createRun")
    e.printStackTrace()
}
```

### Parameters
| **createRunRequest** | [**CreateRunRequest**](CreateRunRequest.md)| Run creation payload | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **xTrichterDeviceToken** | **kotlin.String**|  | [optional] |

### Return type

[**RunDto**](RunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

<a id="deleteRun"></a>
# **deleteRun**
> deleteRun(id)

Delete a run

Deletes a run and its stored image if present. Admin only.

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 38400000-8cf0-11bd-b23e-10b96e4ef00d // kotlin.String | Run ID
try {
    apiInstance.deleteRun(id)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#deleteRun")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#deleteRun")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**| Run ID | |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a id="getRun"></a>
# **getRun**
> RunDto getRun(id)

Get run by ID

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 0787de56-ca0d-4109-b579-70122a73867b // kotlin.String | Run ID
try {
    val result : RunDto = apiInstance.getRun(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#getRun")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#getRun")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**| Run ID | |

### Return type

[**RunDto**](RunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a id="getRunImage"></a>
# **getRunImage**
> org.trichter.api.client.infrastructure.OctetByteArray getRunImage(id)

Download run image

Returns the raw image bytes

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 38400000-8cf0-11bd-b23e-10b96e4ef00d // kotlin.String | Run ID
try {
    val result : org.trichter.api.client.infrastructure.OctetByteArray = apiInstance.getRunImage(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#getRunImage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#getRunImage")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**| Run ID | |

### Return type

[**org.trichter.api.client.infrastructure.OctetByteArray**](org.trichter.api.client.infrastructure.OctetByteArray.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: image/*

<a id="getRunImageSignedUrl"></a>
# **getRunImageSignedUrl**
> SignedImageUrl getRunImageSignedUrl(id)

Get signed image URL

Returns a temporary signed URL for accessing the run image

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 38400000-8cf0-11bd-b23e-10b96e4ef00d // kotlin.String | Run ID
try {
    val result : SignedImageUrl = apiInstance.getRunImageSignedUrl(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#getRunImageSignedUrl")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#getRunImageSignedUrl")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**| Run ID | |

### Return type

[**SignedImageUrl**](SignedImageUrl.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a id="getRuns"></a>
# **getRuns**
> PagedModelRunDto getRuns(page, size, sort)

List runs

Returns paginated runs sorted by creation date (newest first)

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val page : kotlin.Int = 56 // kotlin.Int | Zero-based page index (0..N)
val size : kotlin.Int = 56 // kotlin.Int | The size of the page to be returned
val sort : kotlin.collections.List<kotlin.String> =  // kotlin.collections.List<kotlin.String> | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
try {
    val result : PagedModelRunDto = apiInstance.getRuns(page, size, sort)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#getRuns")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#getRuns")
    e.printStackTrace()
}
```

### Parameters
| **page** | **kotlin.Int**| Zero-based page index (0..N) | [optional] [default to 0] |
| **size** | **kotlin.Int**| The size of the page to be returned | [optional] [default to 20] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **sort** | [**kotlin.collections.List&lt;kotlin.String&gt;**](kotlin.String.md)| Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | [optional] |

### Return type

[**PagedModelRunDto**](PagedModelRunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a id="getRunsByUser"></a>
# **getRunsByUser**
> PagedModelRunDto getRunsByUser(userId, page, size, sort)

List runs by user

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val userId : kotlin.String = user-123 // kotlin.String | User ID
val page : kotlin.Int = 56 // kotlin.Int | Zero-based page index (0..N)
val size : kotlin.Int = 56 // kotlin.Int | The size of the page to be returned
val sort : kotlin.collections.List<kotlin.String> =  // kotlin.collections.List<kotlin.String> | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
try {
    val result : PagedModelRunDto = apiInstance.getRunsByUser(userId, page, size, sort)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#getRunsByUser")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#getRunsByUser")
    e.printStackTrace()
}
```

### Parameters
| **userId** | **kotlin.String**| User ID | |
| **page** | **kotlin.Int**| Zero-based page index (0..N) | [optional] [default to 0] |
| **size** | **kotlin.Int**| The size of the page to be returned | [optional] [default to 20] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **sort** | [**kotlin.collections.List&lt;kotlin.String&gt;**](kotlin.String.md)| Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | [optional] |

### Return type

[**PagedModelRunDto**](PagedModelRunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a id="updateRunUser"></a>
# **updateRunUser**
> RunDto updateRunUser(id, updateRunUserRequest)

Update assigned user of a run

Reassigns an existing run to another user. Admin only.

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 38400000-8cf0-11bd-b23e-10b96e4ef00d // kotlin.String | Run ID
val updateRunUserRequest : UpdateRunUserRequest =  // UpdateRunUserRequest | 
try {
    val result : RunDto = apiInstance.updateRunUser(id, updateRunUserRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#updateRunUser")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#updateRunUser")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**| Run ID | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **updateRunUserRequest** | [**UpdateRunUserRequest**](UpdateRunUserRequest.md)|  | |

### Return type

[**RunDto**](RunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*

<a id="uploadRunImage"></a>
# **uploadRunImage**
> RunDto uploadRunImage(id, file)

Upload run image

Uploads or replaces an image for a run. Only the run creator or an admin may upload.

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = RunsApi()
val id : kotlin.String = 38400000-8cf0-11bd-b23e-10b96e4ef00d // kotlin.String | Run ID
val file : io.ktor.client.request.forms.FormPart<io.ktor.client.request.forms.InputProvider> = BINARY_DATA_HERE // io.ktor.client.request.forms.FormPart<io.ktor.client.request.forms.InputProvider> | Image file (JPEG recommended)
try {
    val result : RunDto = apiInstance.uploadRunImage(id, file)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling RunsApi#uploadRunImage")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling RunsApi#uploadRunImage")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**| Run ID | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file** | **io.ktor.client.request.forms.FormPart&lt;io.ktor.client.request.forms.InputProvider&gt;**| Image file (JPEG recommended) | |

### Return type

[**RunDto**](RunDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*

