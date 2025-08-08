# 🛠️ Guia de Correção - Imagens 404

## 📋 Problema
Imagens mostrando "imagem não encontrada" ou erro 404 no lugar das imagens de upload.

## ✅ Solução Passo a Passo

### 1. Verificar Configuração de Uploads

**Arquivo: `application.properties`**
```properties
# Configuração de uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Diretório de uploads
upload.path=./uploads/
upload.url=/uploads/
```

### 2. Configurar Static Resources

**Arquivo: `StaticResourceConfig.java`**
```java
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    
    @Value("${upload.path}")
    private String uploadPath;
    
    @Value("${upload.url}")
    private String uploadUrl;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(uploadUrl + "**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600);
    }
}
```

### 3. Verificar Diretório de Uploads

**Comando para verificar diretório:**
```bash
# Verificar se o diretório existe
ls -la socioambiental-blog/server/uploads/

# Verificar permissões
chmod -R 755 socioambiental-blog/server/uploads/
```

### 4. Configuração de CORS para Imagens

**Arquivo: `CorsFilter.java`**
```java
@Component
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) 
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
```

### 5. Verificar URLs das Imagens

**Comando para testar URLs:**
```bash
# Testar se as imagens estão acessíveis
curl -I https://blogsocioambiental-afs-1.onrender.com/uploads/nome-da-imagem.jpg

# Verificar logs de erro
tail -f socioambiental-blog/server/logs/application.log
```

### 6. Configuração de Uploads no Frontend

**Arquivo: `imageUtils.js`**
```javascript
// Configuração de URLs de imagem
const IMAGE_CONFIG = {
  baseUrl: 'https://blogsocioambiental-afs-1.onrender.com',
  uploadPath: '/uploads/',
  fallbackImage: '/images/placeholder.jpg'
};

// Função para obter URL de imagem
export const getImageUrl = (filename) => {
  if (!filename) return IMAGE_CONFIG.fallbackImage;
  return `${IMAGE_CONFIG.baseUrl}${IMAGE_CONFIG.uploadPath}${filename}`;
};

// Função para verificar se imagem existe
export const checkImageExists = async (filename) => {
  try {
    const response = await fetch(getImageUrl(filename));
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar imagem:', error);
    return false;
  }
};
```

### 7. Configuração de Diretório de Uploads

**Comando para criar diretório:**
```bash
# Criar diretório de uploads
mkdir -p socioambiental-blog/server/uploads

# Definir permissões
chmod -R 755 socioambiental-blog/server/uploads

# Verificar se está funcionando
ls -la socioambiental-blog/server/uploads/
```

### 8. Verificação Final

**Comando para verificar configuração:**
```bash
# Verificar se as imagens estão sendo servidas
curl -I https://blogsocioambiental-afs-1.onrender.com/uploads/nome<read_file>
<path>socioambiental-blog/client/src/utils/imageUtils.js</path>
</read_file>
