import React from "react"

export const App = props => {
  return (
    <div>
      <strong>Artworks</strong>
      <div>
        {props.artworks.map((artwork, key) => {
          return (
            <div key={key}>
              <div>{artwork.artist.name}</div>
              <div>{artwork.artist.bio}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
