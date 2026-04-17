# ActuatorApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**health**](ActuatorApi.md#health) | **GET** /actuator/health | Actuator web endpoint &#39;health&#39; |
| [**info**](ActuatorApi.md#info) | **GET** /actuator/info | Actuator web endpoint &#39;info&#39; |


<a id="health"></a>
# **health**
> kotlin.String health()

Actuator web endpoint &#39;health&#39;

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = ActuatorApi()
try {
    val result : kotlin.String = apiInstance.health()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ActuatorApi#health")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ActuatorApi#health")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**kotlin.String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/vnd.spring-boot.actuator.v3+json, application/vnd.spring-boot.actuator.v2+json, application/json

<a id="info"></a>
# **info**
> kotlin.String info()

Actuator web endpoint &#39;info&#39;

### Example
```kotlin
// Import classes:
//import org.trichter.api.client.infrastructure.*
//import org.trichter.api.client.models.*

val apiInstance = ActuatorApi()
try {
    val result : kotlin.String = apiInstance.info()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling ActuatorApi#info")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling ActuatorApi#info")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**kotlin.String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/vnd.spring-boot.actuator.v3+json, application/vnd.spring-boot.actuator.v2+json, application/json

