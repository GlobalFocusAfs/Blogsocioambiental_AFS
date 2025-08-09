# Guia Completo de Configuração do Cloudinary

## 1. Configurar Permissões para Uploads via API

### A. Criar Upload Preset
1. Acesse o painel do Cloudinary: https://cloudinary.com/console
2. Vá para **Settings** → **Upload**
3. Role até **Upload presets** e clique em **Add upload preset**
4. Configure as seguintes opções:

**Configurações do Upload Preset:**
- **Name**: `blog-socioambiental` (ou qualquer nome descritivo)
- **Mode**: `Unsigned` (para uploads diretos do frontend)
- **Folder**: `socioambiental-blog`
- **Use filename**: `true`
- **Unique filename**: `false`
- **Overwrite**: `false`
- **Resource type**: `Auto`

### B. Configurações de Segurança
1. Em **Settings** → **Security**
2. Configure:
   - **Allowed origins**: Adicione seu domínio (ex: `https://blogsocioambiental-afs-1.onrender.com`)
   - **CORS**: Ative para permitir requisições do seu frontend

## 2. Verificar Pasta "socioambiental-blog"

### A. Via Painel do Cloudinary
1. Acesse **Media Library**
2. Clique em **Create folder**
3. Nomeie como `socioambiental-blog`
4. Verifique se a pasta aparece na estrutura

### B. Via API (Teste)
```bash
# Teste via curl
curl -X GET \
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources/image?prefix=socioambiental-blog" \
  -u "YOUR_API_KEY:YOUR_API_SECRET"
```

## 3. Testar Uploads Manuais via Painel

### A. Upload Simples
1. Vá para **Media Library**
2. Clique em **Upload** → **Upload files**
3. Selecione uma imagem de teste
4. Na opção **Folder**, selecione `socioambiental-blog`
5. Clique em **Upload**

### B. Verificar URL Gerada
Após upload, a URL será algo como:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/socioambiental-blog/nome-da-imagem.jpg
```

## 4. Configuração no Backend

### A. application.properties
```properties
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
```

### B. Teste de Integração
```bash
# Teste o endpoint de upload
curl -X POST \
  https://blogsocioambiental-afs-1.onrender.com/api/cloudinary/upload \
  -F "file=@/caminho/para/imagem-teste.jpg"
```

## 5. Verificação Final

### A. Teste no Frontend
1. Acesse o formulário de criação de post
2. Faça upload de uma imagem
3. Verifique se a URL retornada é do Cloudinary
4. Confirme que a imagem aparece corretamente no post

### B. Logs de Verificação
Adicione ao seu CloudinaryController:
```java
@GetMapping("/test-config")
public ResponseEntity<Map<String, String>> testConfig() {
    Map<String, String> response = new HashMap<>();
    response.put("cloudName", cloudinary.config.cloudName);
    response.put("folder", "socioambiental-blog");
    response.put("status", "Configuração ativa");
    return ResponseEntity.ok(response);
}
```

## 6. Troubleshooting Comum

### Erro: "Invalid cloud name"
- Verifique se o cloud name está correto no application.properties
- Confirme que está usando o cloud name, não o nome da conta

### Erro: "Invalid signature"
- Verifique se API key e API secret estão corretos
- Confirme que não há espaços extras nas credenciais

### Erro: "Folder not found"
- Crie manualmente a pasta `socioambiental-blog` no Media Library
- Ou configure para criar automaticamente via upload preset

## 7. Comandos Úteis

### Verificar configuração
```bash
# Teste de conexão
curl -X GET \
  https://blogsocioambiental-afs-1.onrender.com/api/cloudinary/health
```

### Listar imagens na pasta
```bash
curl -X GET \
  "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/resources/image?prefix=socioambiental-blog" \
  -u "YOUR_API_KEY:YOUR_API_SECRET"
