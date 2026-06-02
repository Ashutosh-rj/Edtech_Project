$services = @(
    "discovery-server",
    "config-server",
    "api-gateway",
    "auth-service",
    "user-service",
    "course-service",
    "enrollment-service",
    "lecture-service",
    "review-service",
    "quiz-service",
    "notification-service",
    "analytics-service",
    "certificate-service"
)

Write-Host "Starting all EdTech Microservices one by one..."

foreach ($service in $services) {
    Write-Host "Starting $service..."
    
    # Start the service in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD'; Write-Host 'Running $service...'; mvn spring-boot:run -pl $service`""
    
    # Wait to ensure dependencies like discovery-server start before the rest
    if ($service -eq "discovery-server" -or $service -eq "config-server") {
        Write-Host "Waiting 20 seconds for $service to initialize..."
        Start-Sleep -Seconds 20
    } else {
        Start-Sleep -Seconds 5
    }
}

Write-Host "All services have been triggered!"
