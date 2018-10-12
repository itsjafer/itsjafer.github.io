import React, { Component } from "react";
 
class Favourites extends Component {
  render() {
    return (
      <div>
        <p>For whatever reason, I've found that I <b>really</b> enjoy making lists of things that I like so I thought I'd put some (all?) of them here. <b>Bolded</b> means work in progress. Last updated October 2018.</p>
      
        <div className="movies">
        <h3>Movies</h3>
        <ul>
          <li>Shawshank Redemption</li>
          <li>The Dark Knight trilogy</li>
          <li>12 Angry Men</li>
          <li>Inception</li>
          <li>Forrest Gump</li>
          <li>Saving Private Ryan</li>
          <li>The Prestige</li>
          <li>The Green Mile</li>
          <li>Django Unchained</li>
          <li>The Hateful Eight</li>
          <li>Wall-E</li>
          <li>Good Will Hunting</li>
          <li>Reservoir Dogs</li>
          <li>Spider-Man 2</li>
          <li>Gone Girl</li>
          <li>La La Land</li>
          <li>The Truman Show</li>
          <li>BlackKklansman</li>
          <li>Donnie Darko</li>
          <li>Gladiator</li>
          <li>Fight Club</li>
          <li>Back to the Future</li>
          <li>The Breakfast Club</li>
          <li>Ratatouille</li>
          <li>Coach Carter</li>
          <li>Wonder Woman</li>
          <li>O Brother, Where art thou?</li>
          <li>Schindler's List</li>
          <li>I, Robot</li>
          <li>A Quiet Place</li>
          <li>Holes</li>
          <li>Cast Away</li>
          <li>Get Out</li>
          <li>The Martian</li>
          <li>The Big Short</li>
          <li>Slumdog Millionaire</li>
          <li>Dead Poet's Society</li>
          <li>Jumanji</li>
          <li>21 Jump Street</li>
        </ul>
        </div>
        <div className="shows">
        <h3>TV Shows</h3>
          <ul>
            <li>Mad Men</li>
            <li>Breaking Bad</li>
            <li>Game of Thrones</li>
            <li>The Office</li>
            <li>Community</li>
            <li>Brooklyn Nine Nine</li>
            <li>Narcos</li>
            <li>Santa Clarita Diet</li>
            <li>Lost</li>
            <li>Friends</li>
            <li>Black Mirror</li>
            <li>Rick and Morty</li>
            <li>Avatar: the last airbender</li>
            <li>Black Mirror</li>
            <li>Stranger Things</li>
            <li>Firefly</li>
            <li>Imposters</li>
            <li><b>Justified</b></li>
            <li><b>Atlanta</b></li>
            <li><b>Better Call Saul</b></li>
            <li><b>The Twilight Zone</b></li>
            <li><b>Mr. Robot</b></li>
            <li><b>The Wire</b></li>
            <li><b>The Sopranos</b></li>
          </ul>
        </div>

        <div className="games">
        <h3>Video Games</h3>
        <ul>
          <li>Spider-Man</li>
          <li>The Last of Us</li>
          <li>Infamous</li>
          <li>Red Dead Redemption</li>
          <li>GTA IV</li>
          <li>God of War III</li>
          <li>God of War (PS4)</li>
          <li>Portal 2</li>
          <li>BioShock Infinite</li>
          <li>Borderlands 2</li>
          <li>CoD: Black Ops</li>
          <li>Rocket League</li>
          <li>FIFA</li>
          <li>Until Dawn</li>
          <li><b>Uncharted</b></li>
          <li><b>GTA V</b></li>
          <li><b>Horizon Zero Dawn</b></li>
        </ul>
        
        <h3>Board Games</h3>
        <ul>
          <li>The Resistance: Avalon</li>
          <li>Coup</li>
          <li>Codenames</li>
          <li>Bang</li>
          <li>Exploding Kittens</li>
        </ul>
        </div>

        <div className="books">
        <h3>Books</h3>
        <ul>
          <li>Le Petit Prince (Saint-Exupéry)</li>
          <li>Le Compe de Monte-Cristo (Dumas)</li>
          <li>The Name of the Wind (Patrick Rothfuss)</li>
          <li>1984 (George Orwell)</li>
          <li>Brave New World (Aldous Huxley)</li>
          <li>Small Steps (Louis Sachar)</li>
          <li>To Kill a Mockingbird (Harper Lee)</li>
          <li>The Mazerunner (James Dashner)</li>
          <li>Lord of the Flies (William Golding)</li>
          <li>Ender's Game (Orson Scott Card)</li>
          <li>City of Ember (Jeanne DuPrau)</li>
          <li>The Circle (Dave Eggers)</li>
        </ul>
        </div>
      </div>
    );
  }
}
 
export default Favourites;