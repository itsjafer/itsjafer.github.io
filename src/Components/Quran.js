import React, { Component } from 'react';
import AudioPlayer from 'react-h5-audio-player'; 
import 'react-h5-audio-player/lib/styles.css';
class Quran extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chapterNumber: 1,
      verseNumber: 1,
      totalVerseNumber: 1,
      reciter: "ar.alafasy",
      translation: "en.walk",
      isTranslation: false,
      surahs: [],
      format: "audio",
      translationFormat: "audio"
    };
    this.handleEnd = this.handleEnd.bind(this);

  }

  componentDidMount() {
    let quranMetadata = `https://api.alquran.cloud/v1/quran/quran-wordbyword-2`
    fetch(encodeURI(quranMetadata), { method: 'get', mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        this.setState({surahs: json['data']["surahs"]})
        localStorage.setItem('surahs', this.state.surahs)
      })

    let reciterMetadata = `https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse`
    fetch(encodeURI(reciterMetadata), { method: 'get', mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        let staticReciters = [
          {
            "identifier":"translations/Fooladvand_Hedayatfar_40Kbps",
            "language":"fa",
            "englishName":"Hedayatfar",
            "format": "everyayah"
          },
          {
            "identifier":"translations/Makarem_Kabiri_16Kbps",
            "language":"fa",
            "englishName":"Makarem Kabiri",
            "format": "everyayah"
          },
          {
            "identifier":"translations/azerbaijani/balayev",
            "language":"az",
            "englishName":"Belayev",
            "format": "everyayah"
          },
          {
            "identifier":"translations/besim_korkut_ajet_po_ajet",
            "language":"bs",
            "englishName":"Besim Korkut",
            "format": "everyayah"
          },
          {
            "identifier":"translations/urdu_farhat_hashmi",
            "language":"ur",
            "englishName":"Farhat Hashmi (word-by-word)",
            "format": "everyayah"
          },
        ]
        this.setState({reciters: staticReciters.concat(json['data']).sort((a, b) => a.language.localeCompare(b.language))
      })
      })
      this.setState({
        chapterNumber: localStorage.getItem('chapterNumber') || 1,
        verseNumber: localStorage.getItem('verseNumber') || 0,
        totalVerseNumber: localStorage.getItem('totalVerseNumber') || 0,
        format: localStorage.getItem('format') || "audio",
        translationFormat: localStorage.getItem('translationFormat') || "audio",
      })
  }

  handleEnd() {
    if (this.state.translation !== "none" && !this.state.isTranslation) {
      this.setState({isTranslation: true})
      localStorage.setItem('isTranslation', this.state.isTranslation)
      return
    }

    // Check if next verse exists. If it does, increment verse. Otherwise, increment chapter.
    let quranAPI = `https://api.alquran.cloud/v1/ayah/${this.state.chapterNumber}:${Number(this.state.verseNumber) + 1}`
    fetch(encodeURI(quranAPI), { method: 'get', mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        if (json["code"] == 404) {
          let nextChapterNumber = Number(this.state.chapterNumber) + 1
          console.log(nextChapterNumber)
          if (nextChapterNumber == 115) {
            nextChapterNumber = 1
          }
          this.setState({isTranslation: false, chapterNumber: nextChapterNumber, verseNumber: 0, totalVerseNumber: Number(this.state.totalVerseNumber) + 1})
        } else {
          this.setState({isTranslation: false, totalVerseNumber: Number(this.state.totalVerseNumber) + 1, verseNumber: Number(this.state.verseNumber) + 1})
        }
        localStorage.setItem('chapterNumber', this.state.chapterNumber)
        localStorage.setItem('verseNumber', this.state.verseNumber)
        localStorage.setItem('totalVerseNumber', this.state.totalVerseNumber)
      })
  }

  render() {
  
    const {isTranslation, reciter, translation, totalVerseNumber, surahs, reciters, format} = this.state

    const highestBitrates = {
      "ar.abdulbasitmurattal": 192,
      "ar.abdullahbasfar": 192,
      "ar.abdurrahmaansudais": 192,
      "ar.hanirifai": 192,
      "en.walk": 192,
      "ar.ahmedajamy": 128,
      "ar.alafasy": 128,
      "ar.hudhaify": 128,
      "ar.husary": 128,
      "ar.husarymujawwad": 128,
      "ar.mahermuaiqly": 128,
      "ar.minshawi": 128,
      "ar.muhammadayyoub": 128,
      "ar.muhammadjibreel": 128,
      "ar.shaatree": 128,
      "fr.leclerc": 128,
      "zh.chinese": 128,
      "ru.kuliev-audio": 128,
      "ar.abdulsamad": 64,
      "ar.aymanswoaid": 64,
      "ar.minshawimujawwad": 64,
      "ar.saoodshuraym": 64,
      "ur.khan": 64,
      "ar.parhizgar": 48,
      "fa.hedayatfarfooladvand": 40,
      "ar.ibrahimakhbar": 32
    }
    
    console.log(totalVerseNumber, this.state.verseNumber)
    console.log(reciter, format)
    console.log(translation, this.state.translationFormat)
    let arabicSRC = `https://everyayah.com/data/${reciter}/${String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.format === "audio") {
      arabicSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[reciter]}/${reciter}/${totalVerseNumber}.mp3`
    }
    let translationSRC = `https://everyayah.com/data/${translation}/${String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.translationFormat === "audio") {
      translationSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[translation]}/${translation}/${totalVerseNumber}.mp3`
    }
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

    let formatWordByWord = (text, includeEnglish) => {
      let json = JSON.parse(text)
      if (includeEnglish) {
          return json.map(word => `${word["word_arabic"]} (${word["word_translation"]})`).join(' ')
        } 
        return json.map(word => `${word["word_arabic"]}`).join(' ')
    }


    return (
      <div>
        <p>This is a nice, simple Quran player that allows you to listen to the Quran while choosing between Arabic reciters and non-Arabic translations interchangeably.</p>
        
        <div className="Resume">
        {/* <p>Reciter:</p> */}
        <select value={this.state.reciter} onChange={(e)=> {this.setState({reciter: e.target.value, format: e.target.selectedOptions[0].getAttribute('audioformat')}); localStorage.setItem("format", this.state.format); localStorage.setItem("reciter", this.state.reciter);}}>
        {
          reciters && reciters.map(option => <option key={option['identifier']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
        }
        </select>
        {/* <p>Translation:</p> */}
        <select value={this.state.translation} onChange={(e)=> {  this.setState({translation: e.target.value, translationFormat: e.target.selectedOptions[0].getAttribute('audioformat')}); localStorage.setItem("translation", translation); localStorage.setItem("translationFormat", this.state.translationFormat);} }>
        {
          reciters && reciters.map(option => option['language'] !== "ar" && <option key={option['identifier']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
        }
        {
          <option key="none" audioformat="none" value="none">None</option>
        }
        </select>
        {/* <p>Chapter:</p> */}
        <select value={this.state.chapterNumber} onChange={(e)=> {this.setState({chapterNumber: e.target.value, verseNumber: 1, totalVerseNumber: surahs[Number(e.target.value) - 1]["ayahs"][0]["number"], isTranslation: false }); localStorage.setItem("chapterNumber", this.state.chapterNumber); localStorage.setItem("verseNumber", this.state.verseNumber); localStorage.setItem("totalVerseNumber", this.state.totalVerseNumber); localStorage.setItem("isTranslation", this.state.isTranslation);}}>
        {surahs && surahs.map(option => <option key={option["number"]} value={option["number"]}>{option["number"]}: {option["englishName"]}</option>)}
        </select>
        {/* <p>Verse:</p> */}
        <select value={this.state.totalVerseNumber} onChange={(e)=> { this.setState({totalVerseNumber: e.target.value, verseNumber: e.target.selectedOptions[0].getAttribute("surahnumber"), isTranslation: false }); localStorage.setItem("chapterNumber", this.state.chapterNumber); localStorage.setItem("verseNumber", this.state.verseNumber); localStorage.setItem("totalVerseNumber", this.state.totalVerseNumber); localStorage.setItem("isTranslation", this.state.isTranslation);}}>
        {surahs && surahs[Number(this.state.chapterNumber) - 1] && surahs[Number(this.state.chapterNumber) - 1]["ayahs"].map(option => <option key={option["number"]} surahnumber={Number(option["numberInSurah"])} value={Number(option["number"])}>{option["numberInSurah"]}: {formatWordByWord(option["text"], false)}</option>)}
        </select>
        <AudioPlayer
          // autoPlay
          src={isTranslation ? translationSRC : arabicSRC}
          volume={0.5}
          onEnded={this.handleEnd}
          onError={this.handleEnd}
          // Try other props!
        />
        <br/>
        <div className='translation'>
        {surahs[Number(this.state.chapterNumber) - 1] && formatWordByWord(surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], true)}
        </div>
        </div>
      </div>
    );
  }
}

export default Quran;
