
<p align="center" style="font-weight: bold; font-size: 1.5em">@bit-about/native-portal</p>
<p align="center">
<a href="https://www.npmjs.com/package/@bit-about/native-portal"><img alt="" src="https://img.shields.io/npm/v/@bit-about/native-portal.svg" /></a>
<a href="https://bundlephobia.com/package/@bit-about/native-portal"><img alt="Bundle size" src="https://img.shields.io/bundlephobia/minzip/@bit-about/native-portal?label=size" /></a>
<a href="https://codecov.io/gh/bit-about/native-portal"><img alt="" src="https://img.shields.io/codecov/c/github/bit-about/native-portals?token=BuGi92VqnL" /></a>
</p>

## Install

```bash
npm i @bit-about/native-portal
```

## Features

- 100% **Idiomatic React**
- 100% Typescript with state types deduction
- Efficient
- No centralized portals provider
- Tiny
- **Just works** ™

## Usage

```tsx
import { portal } from '@bit-about/native-portal'

// 1️⃣ Create a portal
const Portal = portal()

// 2️⃣ Wrap your app with Provider
const App = () => (
  <Portal.Provider>
    {/* ... */}
  </Portal.Provider>
)

```


⬜ Declare a Host
```tsx
const ComponentA = () => (
  <>
    <Portal.Host />
  </>
)
```


🌀 ...and then declare a Gate
```tsx
const ComponentB = () => (
  <>
    <Portal.Gate>
      <Text>Hello!</Text>
    </Portal.Gate>
  </>
)
```

Thanks to this, 
when the `ComponentB` is rendered, 
the `Hello!` sentence will be moved to the `ComponentA`.

## Many portals under one provider
```tsx
import { portal } from '@bit-about/native-portal'

// Declare destinations during portal creation
const Portal = portal('portalToHeader', 'portalToMenu', 'portalToHeaven')
```

⬜ Declare a Host using `name` prop
```tsx
const Menu = () => (
  <>
    <Portal.Host name="portalToMenu" />
  </>
)
```


🌀 ...and then declare a Gate using `name` prop
```tsx
const Screen = () => (
    <>
      <Portal.Gate name="portalToMenu">
        <Text>{'New menu option'}</Text>
      </Portal.Gate>
    </>
  )
```


## Default content
To declare default content for unused portal you can just declare `children` for `Host`.

```tsx
<Portal.Host name="portalToMenu">
  <Text>{'I`m only visible when there are no Gates rendered'}</Text>
</Portal.Host>
```

## Don't you like components' names?
```tsx
import { portal } from '@bit-about/native-portal'

const {
  Provider: MyAmazingPortalProvider,
  Host: MyAmazingPortalHost,
  Gate: MyAmazingPortalGate,
} = portal()

// ... and then for example

const App = () => (
  <MyAmazingProvider>
    {/* ... */}
  </MyAmazingProvider>
)
```

## Common Questions
##### What happens if I use multiple gates for one portal at the same time?
It works like a stack. The Host will render the latest content. If the latest Gate is removed from the tree, the host will render the previous one, etc.

##### What happens if I use multiple hosts for one portal at the same time?
Each host will display the same content.

##### Do I need to render the Host before the Gate?
Nope! When you render Host it will be automatically filled up by the latest content.

##### Is this efficient? What about the re-renders?
Yes. Moreover, Providers and Gates components will be never unecessary re-rendered.
Gates rerender only when the latest content changes.

## Partners  
<a href="https://www.wayfdigital.com/"><img alt="wayfdigital.com" width="100" height="100" src="https://user-images.githubusercontent.com/1496580/161037415-0503f763-a60b-4d40-af9f-95d1304fa486.png"/></a>

## Credits
- [use-context-selector](https://github.com/dai-shi/use-context-selector) & [FluentUI](https://github.com/microsoft/fluentui) - fancy re-render avoiding tricks and code main inspiration

## License
MIT © [Maciej Olejnik 🇵🇱](https://github.com/macoley)

## Support me 

<a href="https://github.com/sponsors/macoley"><img alt="Support me!" src="https://img.shields.io/badge/github.com-Support%20me!-green"/></a>

If you use my library and you like it...<br />
it would be nice if you put the name `BitAboutNativePortal` in the work experience section of your resume.<br />
Thanks 🙇🏻! 


---
<p align="center">🇺🇦 Slava Ukraini</p>