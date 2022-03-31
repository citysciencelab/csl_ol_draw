# CSL Open Layers Drawing


On the Touchscreen an Openlayers based sketching tool enables planners to generate GeoJson.
This data is further displayed and analysed and thos results are displayed on the Infoscreen.
Further branches of this project have connectors to Unity to display the GeoJson in an AR context .. mor information will follow.

https://user-images.githubusercontent.com/36763878/161041509-d3efdf9e-1fc8-42ad-a3d6-fa556901e3db.mp4

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.2.

## Installing

```
npm install
```
## Configuration

Copy the configuration template from `src/app/config-dist.json` to `src/app/config.json` and adjust it to your needs.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.
Add the `--host 0.0.0.0` parameter if you want to access the app from another computer in the network.

## How to run the app

The project has two major views and is initially designed for a touchscreen in combination with an infoscreen.
The touchscreen component can be called via `http://localhost:4200/draw` the infoscreen via `http://localhost:4200/infoscreen`

Parts of the menu structure and the navigation are currently deactivated.
These contain code for the further development of the tool:
  - Setting the designated spacial distribution (e.g. 5000 m² of residential area ...) which will be displayed in the infoscreen spider graph
  - Comparison of different designs
  - Selection of the focus area (so far it is always set to Grasbrook, Hamburg, Germany)
  - Downloadable geoJSON

As some functionality is specifically designed to work with a big touchscreen - minor adjustment might make sense:
I case you want to fully try out the rotation of touch and infoscreen add the following code to the map (map-draw.component.ts initMap())
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
And deactivate the following code (also map-draw.component.ts initMap() last line)
      this.addDrawInteraction();


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
