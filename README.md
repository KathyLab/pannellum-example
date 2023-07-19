# pannellum-example

This is a panorama viewer example developed with Vue 3 in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## How to use
you can custom your viewer using `EasyPannellum` component

```html
<EasyPannellum
  :scene-option="sceneOption"
  :hot-spot-debug="false"
  :enableEdit="true"
/>
```
see more in `HomeView` file.

### Component Props
#### firstScene `(String, optional)`
figure out the first scene you want to show after initial

#### sceneOption `(Object required)`
```ts
sceneOption = {
  [type: string]: 'equirectangular', // only one type is currently supported
  [sceneId: string]: {
    [title: string]: 'your title here',
    [hfov: ?number]: 100, // 'panorama’s starting horizontal field of view in degrees'
    [yaw: ?number]: 0, // panorama’s starting yaw position in degrees. (z axis)
    [pitch: ?number]: 0 // panorama’s starting pitch position in degrees. (y axis)
    [panorama: string]: 'http://...image-url-here', // panorama url
    [hotSpots: ?Array]: [
      {
        pitch: 1.57, // see above
        yaw: -66.7,
        [type: string]: 'scene', // hot spot type: 'scene' | 'info'
        [text: string]: 'enter bedroom', // description of hot spot
        sceneId: 'bedroom', // sceneId
        [targetYaw: ?number]: -23, // target yaw
        [targetPitch: ?number]: 2, // target pitch
        [id: any]: 1
      },
      {
        pitch: -17.79,
        yaw: -122.95,
        type: 'info',
        text: 'dinner table',
        id: 2
      },
      // ...add more here
    ]
  },
  // ...more scenes configuration here
}

```

#### enableEdit `(Boolean, optional)`
`true | false`
you can just view when set it false. To enable adding hot spot or tour, then set it true.

#### hotSpotDebug `(Boolean, optional)`
`true | false`
Set it true will print coordinate to the console 

## Method

- loadScene: load scenes whenever you want
- resize: should be called if the viewer's container is resized

## Licence

MIT