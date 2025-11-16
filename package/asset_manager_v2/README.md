# Asset Manager (v2)

This package implements a resource manager for the game engine and music engine.

This resource manager uses a chain of loaders to enable more flexible asset packaging workflows.

## Usage

For each resource, a user must define the chain of loaders, and which other resources this resource is dependent on.

For example, the process for loading an audio file would look something like this:

`audio_file`: __Fetch(path=http://example.com/static/audio.ogg, as="binary")__ ==> __AudioElement(loop=false)__

Meanwhile, a combined asset file that is split into separate resources might look something like this:

`asset_archive`: __Fetch(path=..., as="binary")__ ==> __Decompress(type="zip")__ ==> __ToListing()__
`audio_file`: __Asset(name="asset_archive")__ ==> __GetFileFromListing(path="audio.ogg")__
`item_stats`: __Asset(name="asset_archive")__ ==> __GetFileFromListing(path="stats.csv")__ ==> __ReadCSV(options=...)__
`scene`: __Asset(name="asset_archive")__ ==> __GetFileFromListing(path="stats.csv")__ ==> __ReadJSON()__ ==> __Prefab(type="scene")__

In addition, resources can be grouped to help with loading assets needed in a scene:

Group(name="Intro Scene") {
    `audio_file`,
    `scene`,
    `image1`
}

Group(name="Level 1") {
    `audio_file`,
    `scene`,
    `prefab`,
    `...`
}

These definitions will use a JSON schema:

Asset Definition:
- name: asset name, must be unique
- meta: Queryable metadata
- chain: Chained Loader Definition (array)

Loader Definition:
- type: loader type
- options: object of parameters, depends on the type of loader

Group Definition
- name: Group Name
- asset_names: Asset Name array

## Requirements
- [Justfile](https://just.systems/)
- 
