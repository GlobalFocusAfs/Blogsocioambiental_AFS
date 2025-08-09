package com.example.socioambiental.config;

import org.springframework.stereotype.Component;
import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // CORS configuration handled by GlobalCorsConfig
        // This filter is now disabled to prevent conflicts
        
        chain.doFilter(request, response);
    }
}
