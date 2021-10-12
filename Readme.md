# Docker Image Resizer

Resize and Optimize image on-the-fly

Node-alpine service to transform images from another service on the fly (s3, google cloud storage, ...)

- Download the original image using the query path
- Transform the image (resize, format, blur, ...) using query parameters
- Return the image with cache and mime headers

Use the following libraries:

- [Express - minimalist web framework](https://github.com/expressjs/express)
- [Axios - Promise based HTTP client](https://github.com/axios/axios)
- [Sharp - High performance Node.js image processing](https://github.com/lovell/sharp)

## Links

- [Github]()
- [Docker Hub](https://hub.docker.com/repository/docker/kefniark/image-resizer)

## Getting Started

### Docker

```yaml
imgresizer:
  image: kefniark/image-resizer
  environment:
    # the host of original images
    - STORAGE_HOST=https://your.website.com/
    # cache in minutes
    - CACHE=300
    # server port
    - PORT=80
  ports:
    - 80:80
```

### Locally

or if you want to run it locally in node, put your env variables in a `.env` file then run

```sh
yarn
yarn dev
```

---

## Usage

### Example

**Url**: `http://localhost:8000/images/subfolder/image.jpg?width=100&height=100`

- Our resize service: `http://localhost:8000/`
- Image path: `images/subfolder/image.jpg` => will be resolved to `https://your.website.com/images/subfolder/image.jpg`
- Transformation params: `?width=100&height=100`

### Parameters

#### Resize

- `width`: number in the range 10 <> 2048
- `height`: number in the range 10 <> 2048
- `fit`: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

#### Effects

- `blur`: number in the range 0.3 <> 1000
- `rotate`: number in the range -360 <> 360
- `grey`: boolean
- `normalize`: boolean

#### Output

- `format`: 'jpg' | 'png' | 'webp'
- `quality`: number in the range 1 <> 100

### Common usages

- **Format conversion** : `?format=jpg`
- **Optimize for small size** : `?format=webp&quality=5`
- **Thumbnail** : `?height=200&format=webp`
- **Thumbnail (contains)** : `?width=200&height=200&format=webp&fit=contain`
- **Blurred Background** : `?width=640&height=360&format=webp&blur=9`

---

## Developers

### Commands

```
yarn lint
yarn test
yarn build
```

### Docker Publish

```sh
docker build -t kefniark/image-resizer:latest .
docker push kefniark/image-resizer:latest
```
