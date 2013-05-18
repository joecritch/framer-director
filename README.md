# Framer Director

This is a quick, *opinionated* experiment at improving my workflow with V2 of <a href="http://www.framerjs.com/">Framer.js</a>, the iOS prototyping tool.

## Set up

Include the `framer-director.js` file and then call this in your `app.js`:

```javascript
var director = new FramerDirector(viewConfig, 200, 'ease-out');
```

***IMPORTANT: See the View Config section***

#### Params:

1. View config object (see *View Config*)
2. Duration (this is a global that's passed into all views. Currently no way to change this across different views)
3. Curve (string): again, global, with no override option.

## Naming conventions

+ Sibling views: 'Foo-1', 'Foo-2', etc.
+ Child views: 'Foo-Bar' (where the parent is 'Foo')
+ Child views with siblings: 'Foo-1-Bar', 'Foo-2-Bar'

## View Config

You'll need to be explicit about which properties you want to animate / set. Here's an example of how you should structure your config object…

```javascript
var viewConfig = [
	// This is an example of a sibling set up. So you'd need "Foo-1", "Foo-2", etc. And don't forget to set 'multi' to 'true'
	{
		id: 'Foo',
		multi: true,
		states: {
			// Any 'null' values will get set as the currently computed style, as soon as a new state tries to access it.
			'myFirstState': [
				{y: null},
				{y: null},
				{y: null}
			],
			'mySecondState': [
				{y: -25},
				{y: 752},
				{y: 810}
			]
		},
		// You can define multiple child views. So these would be 'Foo-1-Bar', 'Foo-2-Bar', etc.
		children: {
			'Bar': {
				'myFirstState': [
					{scaleY: 1},
					{scaleY: 1},
					{scaleY: 1}
				],
				'mySecondState': [
					{scaleY: 0.61},
					{scaleY: 0.29},
					{scaleY: 0.29}
				]
			},
			'Barrr': {
				'myFirstState': [
					{scale: 1, x: null},
					{scale: 1, x: null},
					{scale: 1, x: null}
				],
				'mySecondState': [
					{scale: 0.73, x: 40},
					{scale: 0.58, x: 0},
					{scale: 0.58, x: 25}
				]
			}
		}
	},
	// You can also target non-sibling blocks. A simpler form.
	{
		id: 'Activities',
		states: {
			'myFirstState': {opacity: 0},
			'mySecondState': {opacity: 1}
		}
	}
];
```

## Setting a state

Once you've got a director object constructed, you can use the 'setState' method to change the state. This essentially sets, or animates, whichever View objects are wanting to respond to this new state (which are set in your from View Config).

```javascript
director.setState('mySecondState', true);
```

#### Params:

1. The first param is the state alias.
2. The second is an animation flag. Default: false)

### Setting a default state

Default states aren't "built-in", as such. But all it takes is a call to what you would class as your default state. You probably want to avoid turning animation on for that.

Like I mentioned above, any NULL values will be set by their computed value as soon as they're accessed via setState.

### Example: state toggle

Akin to the Framer.JS demo, here's something I made, which toggles between two states, on an event listener.

```javascript
// … get viewConfigObj from above view config example.
var EASE_OUT_EXPO = 'bezier-curve(0.950, 0.050, 0.795, 0.035)';
var STANDARD_DURATION = 300;
var director = new FramerDirector(viewConfigObj, STANDARD_DURATION, EASE_OUT_EXPO);
var toggler = utils.toggle('myFirstState', 'mySecondState');
PSD['Foo-1'].on('click', function(event) {
	event.preventDefault();
	var newState = toggler();
	director.setState(newState, true);
});
```
