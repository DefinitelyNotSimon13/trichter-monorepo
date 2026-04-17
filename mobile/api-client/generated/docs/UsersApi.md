# UsersApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getUserById**](UsersApi.md#getUserById) | **GET** /api/v2/users/{userId} | Get user by ID |
| [**getUsers**](UsersApi.md#getUsers) | **GET** /api/v2/users | Get or search users |


<a id="getUserById"></a>
# **getUserById**
> UserDto getUserById(userId)

Get user by ID

Returns a single user by ID.

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = UsersApi()
val userId : kotlin.String = userId_example // kotlin.String | 
try {
    val result : UserDto = apiInstance.getUserById(userId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling UsersApi#getUserById")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling UsersApi#getUserById")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **userId** | **kotlin.String**|  | |

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a id="getUsers"></a>
# **getUsers**
> PagedModelUserDto getUsers(q, page, size, sort)

Get or search users

Returns a paginated list of users. If &#39;q&#39; is provided, filters by username or display name.

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = UsersApi()
val q : kotlin.String = q_example // kotlin.String | Search query
val page : kotlin.Int = 56 // kotlin.Int | Zero-based page index (0..N)
val size : kotlin.Int = 56 // kotlin.Int | The size of the page to be returned
val sort : kotlin.collections.List<kotlin.String> =  // kotlin.collections.List<kotlin.String> | Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
try {
    val result : PagedModelUserDto = apiInstance.getUsers(q, page, size, sort)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling UsersApi#getUsers")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling UsersApi#getUsers")
    e.printStackTrace()
}
```

### Parameters
| **q** | **kotlin.String**| Search query | [optional] |
| **page** | **kotlin.Int**| Zero-based page index (0..N) | [optional] [default to 0] |
| **size** | **kotlin.Int**| The size of the page to be returned | [optional] [default to 20] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **sort** | [**kotlin.collections.List&lt;kotlin.String&gt;**](kotlin.String.md)| Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. | [optional] |

### Return type

[**PagedModelUserDto**](PagedModelUserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

