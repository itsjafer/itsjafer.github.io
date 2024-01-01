import React, { Component } from 'react';
import AudioPlayer from 'react-h5-audio-player'; 
import 'react-h5-audio-player/lib/styles.css';
import 'tajweed/css/tajweed.css'  
import tajweed, {Tajweed}  from 'tajweed';
import {Helmet} from "react-helmet";
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
      surahsTajweed: [],
      format: "audio",
      translationFormat: "audio",
      playBismillah: false,
      showTajweed: false,
      surahName: "",
      translatorName: "Alafasy",
      reciterName: "Ibrahim Walk"
    };
    this.handleEnd = this.handleEnd.bind(this);

  }

  componentDidMount() {
    let quranMetadata = `https://api.alquran.cloud/v1/quran/quran-wordbyword-2`
    fetch(encodeURI(quranMetadata), { method: 'get', mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        this.setState({surahs: json['data']["surahs"]})
      })

    let tajweedMetadata = `https://api.alquran.cloud/v1/quran/quran-tajweed`
    fetch(encodeURI(tajweedMetadata), { method: 'get', mode: 'cors' })
      .then((response) => response.json())
      .then((json) => {
        this.setState({surahsTajweed: json['data']["surahs"]})
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
          {
            "identifier":"Abdul_Basit_Murattal_192kbps",
            "language":"ar",
            "englishName":"Abdul Basit (Murattal)",
            "format": "everyayah"
          },
          {
            "identifier":"Abdul_Basit_Mujawwad_128kbps",
            "language":"ar",
            "englishName":"Abdul Basit (Mujawwad)",
            "format": "everyayah"
          },
          {
            "identifier":"Minshawy_Mujawwad_192kbps",
            "language":"ar",
            "englishName":"Al Minshawi (Mujawwad)",
            "format": "everyayah"
          },
          {
            "identifier":"Minshawy_Murattal_128kbps",
            "language":"ar",
            "englishName":"Al Minshawi (Murattal)",
            "format": "everyayah"
          },
          {
            "identifier":"Menshawi_32kbps",
            "language":"ar",
            "englishName":"Al Minshawi",
            "format": "everyayah"
          },
          {
            "identifier":"AbdulSamad_64kbps_QuranExplorer.Com",
            "language":"ar",
            "englishName":"Abdul Basit Abdul Samad",
            "format": "everyayah"
          },
          {
            "identifier":"Nasser_Alqatami_128kbps",
            "language":"ar",
            "englishName":"Nasser Al-Qatami",
            "format": "everyayah"
          },
        ]
        this.setState({reciters: staticReciters.concat(json['data']).sort((a, b) => a.language.localeCompare(b.language))
      })
      })
      this.setState({
        chapterNumber: localStorage.getItem('chapterNumber') || 1,
        reciter: localStorage.getItem('reciter') || "ar.alafasy",
        surahName: localStorage.getItem('surahname') || "Al-Fatihah",
        translation: localStorage.getItem('translation') || "en.walk",
        verseNumber: localStorage.getItem('verseNumber') || 0,
        totalVerseNumber: localStorage.getItem('totalVerseNumber') || 0,
        format: localStorage.getItem('format') || "audio",
        translationFormat: localStorage.getItem('translationFormat') || "audio",
        translatorName: localStorage.getItem('translatorName') || "Ibrahim Walk",
        reciterName: localStorage.getItem('reciterName') || "Alafasy",
      })
  }

  handleEnd() {
    if (this.state.playBismillah) {
      this.setState({playBismillah: false, isTranslation: false})
    } 
    else if (this.state.translation !== "none" && !this.state.isTranslation) {
      this.setState({isTranslation: true})
    } else {

      
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
          this.setState({playBismillah: true, isTranslation: false, chapterNumber: nextChapterNumber, verseNumber: 1, totalVerseNumber: Number(this.state.totalVerseNumber) + 1})
        } else {
          this.setState({isTranslation: false, totalVerseNumber: Number(this.state.totalVerseNumber) + 1, verseNumber: Number(this.state.verseNumber) + 1})
        }
      })
    }
    localStorage.setItem('chapterNumber', this.state.chapterNumber)
    localStorage.setItem('surahname', this.state.surahName)
    localStorage.setItem('verseNumber', this.state.verseNumber)
    localStorage.setItem('totalVerseNumber', this.state.totalVerseNumber)
    localStorage.setItem('reciter', this.state.reciter)
    localStorage.setItem('translation', this.state.translation)
    localStorage.setItem('isTranslation', this.state.isTranslation)
    localStorage.setItem('format', this.state.format)
    localStorage.setItem('translationFormat', this.state.translationFormat)
    localStorage.setItem('translatorName', this.state.translatorName)
    localStorage.setItem('reciterName', this.state.reciterName)

  }

  render() {
  
    const {isTranslation, reciter, translation, totalVerseNumber, surahs, surahsTajweed, reciters, format} = this.state

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
    let arabicSRC = `https://everyayah.com/data/${reciter}/${this.state.playBismillah ? "001001" : String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.format === "audio") {
      arabicSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[reciter]}/${reciter}/${this.state.playBismillah ? 1 : totalVerseNumber}.mp3`
    }
    let translationSRC = `https://everyayah.com/data/${translation}/${this.state.playBismillah ? "001001" : String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.translationFormat === "audio") {
      translationSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[translation]}/${translation}/${this.state.playBismillah ? 1 : totalVerseNumber}.mp3`
    }
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

    let formatWordByWord = (text, includeEnglish) => {
      let json = JSON.parse(text)
      if (includeEnglish) {
          return json.map(word => `${word["word_arabic"]} (${word["word_translation"]})`).join(' ')
        } 
        return json.map(word => `${word["word_arabic"]}`).join(' ')
    }

    let tajweedWords = (tajweedText, translationText, includeEnglish) => {
      if (!includeEnglish) {
        return tajweedText
      }
      let tajweedWordsList = tajweedText.split(" ")
      let translated = JSON.parse(translationText)

      if (tajweedWordsList.length != translated.length) {
        return tajweedText
      }
      return tajweedWordsList.map((word, index) => `${word} (${[translated[index]["word_translation"]]})`).join(' ')
    }

    let parseTajweed = new Tajweed()

    return (
      <div>
        <Helmet>
          <title>{`Quran - ${this.state.surahName} - ${this.state.isTranslation ? this.state.translatorName : this.state.reciterName}`}</title>
          <meta name="description" content={`Quran - ${this.state.surahName} - ${this.state.isTranslation ? this.state.translatorName : this.state.reciterName}`}/>
          <link rel="canonical" href="http://itsjafer.com/#/parser" />
        </Helmet>
        <p>A Qur'an player that allows interlacing of Arabic and Non-Arabic translation audio. Also includes tajweed color-coding and word-by-word translations.</p>
        
        <div className="Resume">
        {/* <p>Reciter:</p> */}
        <select value={this.state.reciter} onChange={(e)=> {this.setState({reciterName: e.target.selectedOptions[0].getAttribute('recitername'),reciter: e.target.value, format: e.target.selectedOptions[0].getAttribute('audioformat')}); }}>
        {
          reciters && reciters.map(option => <option key={option['identifier']} recitername={option['englishName']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
        }
        </select>
        {/* <p>Translation:</p> */}
        <select value={this.state.translation} onChange={(e)=> {  this.setState({translatorName: e.target.selectedOptions[0].getAttribute('translatorname'), translation: e.target.value, translationFormat: e.target.selectedOptions[0].getAttribute('audioformat')}); } }>
        {
          reciters && reciters.map(option => option['language'] !== "ar" && <option key={option['identifier']} translatorname={option['englishName']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
        }
        {
          <option key="none" audioformat="none" value="none">None</option>
        }
        </select>
        {/* <p>Chapter:</p> */}
        <select value={this.state.chapterNumber} onChange={(e)=> {this.setState({chapterNumber: e.target.value, verseNumber: 1, totalVerseNumber: surahs[Number(e.target.value) - 1]["ayahs"][0]["number"], isTranslation: false , surahName: e.target.selectedOptions[0].getAttribute("surahname")})}}>
        {surahs && surahs.map(option => <option key={option["number"]} surahname={option["englishName"]} value={option["number"]}>{option["number"]}: {option["englishName"]}</option>)}
        </select>
        {/* <p>Verse:</p> */}
        <select value={this.state.totalVerseNumber} onChange={(e)=> { this.setState({totalVerseNumber: e.target.value, verseNumber: e.target.selectedOptions[0].getAttribute("surahnumber"), isTranslation: false });}}>
        {surahs && surahs[Number(this.state.chapterNumber) - 1] && surahs[Number(this.state.chapterNumber) - 1]["ayahs"].map(option => <option key={option["number"]} surahnumber={Number(option["numberInSurah"])} value={Number(option["number"])}>{option["numberInSurah"]}: {formatWordByWord(option["text"], false)}</option>)}
        </select>
        <AudioPlayer
          // autoPlay
          src={isTranslation ? translationSRC : arabicSRC}
          volume={0.5}
          onEnded={this.handleEnd}
          onError={this.handleEnd}
          onClickNext={this.skipAhead}
          onClickPrevious={this.skipPrevious}
          // Try other props!
        />
        <br/>
        <div className='translation'>
          <div className='subtitle' onClickCapture={() => this.setState({showTajweed: !this.state.showTajweed})}>
            {this.state.showTajweed ? "Tap to remove translation" : "Tap to add word-by-word translation"}
          </div>

        {this.state.showTajweed ? 
        surahs[Number(this.state.chapterNumber) - 1] && 
        surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        <div dangerouslySetInnerHTML={{__html:parseTajweed.parse(
          tajweedWords(
            surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            true), true) }}></div> 
        : 
        surahs[Number(this.state.chapterNumber) - 1] && 
        surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        <div dangerouslySetInnerHTML={{__html:parseTajweed.parse(
          tajweedWords(surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
          surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
          false), true) }}>
        </div> 
        }
        </div>
        </div>
      </div>
    );
  }
}

export default Quran;
