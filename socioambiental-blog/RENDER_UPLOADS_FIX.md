# 🛠️ Correção do Problema de Uploads no Render

## 📋 Descrição do Problema
As imagens estão retornando 404 (Not Found) no Render porque os arquivos não estão sendo encontrados no servidor.

## ✅ Solução Implementada

### 1. **Caminhos Absolutos**
- Alterado de caminhos relativos (`./uploads/`) para caminhos absolutos usando `System.getProperty("user.dir")`
- Isso garante que o diretório seja sempre encontrado independentemente do diretório de trabalho do Render

### 2. **Configuração de Recursos Estáticos**
- Atualizado `StaticResourceConfig.java` e `RenderResourceConfig.java` para usar caminhos absolutos
- Adicionado suporte para múltiplos padrões de URL

### 3. **Verificação Automática**
- Criado `UploadDirectoryInitializer.java` que cria o diretório de uploads automaticamente ao iniciar
- Adicionado endpoint `/api/system/uploads-info` para diagnóstico

### 4. **Endpoint de Diagnóstico**
- Novo endpoint para verificar status dos uploads: `GET /api/system/uploads-info`

## 🚀 Como Testar

### Teste 1: Verificar Diretório
```bash
curl https://blogsocioambiental-afs-1.onrender.com/api/system/uploads-info
```

### Teste 2: Fazer Upload de Imagem
1. Acesse o frontend
2. Crie um novo post com imagem
3. Verifique se a imagem aparece corretamente

### Teste 3: Verificar Arquivos
```bash
# Lista todos os arquivos no diretório de uploads
curl https://blogsocioambiental-afs-1.onrender.com/api/system/uploads-info | jq .
```

## 🔧 Configuração no Render

### Variáveis de Ambiente (Render Dashboard)
```bash
# Já configurado no application.properties
file.upload-dir=./uploads
```

### Build Command
```bash
# No Render Dashboard > Settings > Build Command
./mvnw clean package
```

### Start Command
```bash
# No Render Dashboard > Settings > Start Command
java -jar target/socioambiental-0.0.1-SNAPSHOT.jar
```

## 📁 Estrutura de Diretórios no Render
```
/workspace/
├── uploads/           # Diretório onde os arquivos são salvos
├── target/
│   └── socioambiental-0.0.1-SNAPSHOT.jar
└── ... outros arquivos
```

## 🐛 Solução de Problemas

### Se as imagens ainda não aparecerem:
1. **Verificar logs do Render**
   ```bash
   # Acesse o dashboard do Render e verifique os logs
   ```

2. **Testar endpoint de diagnóstico**
   ```bash
   curl https://blogsocioambiental-afs-1.onrender.com/api/system/uploads-info
   ```

3. **Verificar se o diretório foi criado**
   - O log deve mostrar: "✅ Diretório de uploads criado: /workspace/uploads"

4. **Testar upload manual**
   - Use o formulário do frontend para fazer upload de uma imagem
   - Verifique se o arquivo aparece no diretório

### Comandos Úteis para Debug
```bash
# Verificar estrutura de diretórios
ls -la /workspace/

# Verificar permissões
ls -la /workspace/uploads/

# Verificar se o servidor está rodando
curl https://blogsocioambiental-afs-1.onrender.com/health
```

## 🔄 Deploy no Render

1. **Fazer commit das mudanças**
   ```bash
   git add .
   git commit -m "Fix: Corrigido problema de uploads no Render"
   git push origin main
   ```

2. **O Render automaticamente fará o deploy**
3. **Aguarde 2-3 minutos para o deploy completar**
4. **Teste as funcionalidades**

## 📞 Suporte
Se o problema persistir após estas alterações:
1. Verifique os logs do Render
2. Use o endpoint `/api/system/uploads-info` para diagnóstico
3. Confirme que o diretório `/workspace/uploads` está sendo criado
