# mood-cal

```sh
npm install
```

```sh
npm run dev
```

### project structure
1) frontend: everything in `src/public`
1) backend: everything in `src` that is not frontend

### api key format in .env
```
OPENAI_API_KEY="your key here"
```


### back-front api
1) correct query
```sh
curl -X POST http://localhost:3000/api/data \
-H "Content-Type: application/json" \
-d '{"data": "Hello0World"}'
```

1) incorrect query
```sh
curl -X POST http://localhost:3000/api/data \
-H "Content-Type: application/json" \
-d '{"data": 506}'
```