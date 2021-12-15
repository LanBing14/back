# 框架启动步骤

## 安装项目依赖
```
# 配置镜像代理地址
npm config set registry https://registry.npm.taobao.org --global 
npm config set disturl https://npm.taobao.org/dist --global

# 安装vue-cli
npm install -g @vue/cli(如果没有则安装一下)

# 安装依赖
npm install
```

### 运行开发环境
```
npm run dev
```

### 运行生产环境
```
npm run build
```

### 测试代码的可执行性
```
npm run lint
```

### 更多vue-cli配置
前住 [Configuration Reference](https://cli.vuejs.org/zh/config/).
