package com.springgithub.springgithub.services.stackoverflow.validators;

import com.springgithub.springgithub.services.RESTUtil;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;

public class CustomStackVallidator implements ResponseErrorHandler {

    private boolean found;  // 404 Error Handler
    private boolean badRequest; // 400 Bad Request
    private boolean unexpected;

    public CustomStackVallidator() {
        this.found = true;
        this.badRequest = false;
        this.unexpected = false;
    }

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return RESTUtil.isError(response.getStatusCode());
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String responseBody = "";
        if(response != null && response.getBody() != null) {
            responseBody = response.getBody().toString();
        }
        switch (response.getRawStatusCode()) {
            case 200:
                this.found = true;
            case 404:
                this.found = false;
            case 400:
                this.badRequest = true;
            case 500:
                this.found = false;
            default:
                this.unexpected = true;
        }
    }

    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }


}
