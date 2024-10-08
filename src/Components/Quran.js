import React, { Component } from 'react';
import AudioPlayer from 'react-h5-audio-player'; 
import 'react-h5-audio-player/lib/styles.css';
import 'tajweed/css/tajweed.css'  
import tajweed, {Tajweed}  from 'tajweed';
import {Helmet} from "react-helmet";
import getDescription from './Description';
import corpus from './corpus.json'

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
      reciterName: "Ibrahim Walk",
      fullscreen: false
    };
    this.handleEnd = this.handleEnd.bind(this);

  }

  fetchPlus = (url, options = {}, retries) =>
  fetch(url, options)
    .then(res => {
      if (res.ok) {
        return res
      }
      if (retries > 0) {
        return this.fetchPlus(url, options, retries - 1)
      }
      throw new Error(res.status)
    })

  componentDidMount() {
    let quranMetadata = `https://api.alquran.cloud/v1/quran/quran-wordbyword-2`
    this.fetchPlus(encodeURI(quranMetadata), { method: 'get', mode: 'cors' }, 3)
      .then((response) => response.json())
      .then((json) => {
        this.setState({surahs: json['data']["surahs"]})
      })

    let tajweedMetadata = `https://api.alquran.cloud/v1/quran/quran-tajweed`
    this.fetchPlus(encodeURI(tajweedMetadata), { method: 'get', mode: 'cors' }, 3)
      .then((response) => response.json())
      .then((json) => {
        this.setState({surahsTajweed: json['data']["surahs"]})
      })
    
    let reciterMetadata = `https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse`
    this.fetchPlus(encodeURI(reciterMetadata), { method: 'get', mode: 'cors' }, 3)
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
        showTajweed: localStorage.getItem('showtajweed') || false,
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
      this.fetchPlus(encodeURI(quranAPI), { method: 'get', mode: 'cors' }, 3)
      .then((response) => response.json())
      .then((json) => {
        if (json["code"] == 404) {
          let nextChapterNumber = Number(this.state.chapterNumber) + 1
          if (nextChapterNumber == 115) {
            nextChapterNumber = 1
          }
          this.setState({playBismillah: true, isTranslation: false, chapterNumber: nextChapterNumber, verseNumber: 1, totalVerseNumber: Number(this.state.totalVerseNumber) + 1})
        } else {
          this.setState({isTranslation: false, totalVerseNumber: Number(this.state.totalVerseNumber) + 1, verseNumber: Number(this.state.verseNumber) + 1})
        }
      })
      .catch(error => {
        console.log(error)
        let nextChapterNumber = Number(this.state.chapterNumber) + 1
        if (nextChapterNumber == 115) {
          nextChapterNumber = 1
        }
        this.setState({playBismillah: true, isTranslation: false, chapterNumber: nextChapterNumber, verseNumber: 1, totalVerseNumber: Number(this.state.totalVerseNumber) + 1})
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
    localStorage.setItem('showtajweed', this.state.showTajweed)
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
    
    let arabicSRC = `https://everyayah.com/data/${reciter}/${this.state.playBismillah ? "001001" : String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.format === "audio") {
      arabicSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[reciter]}/${reciter}/${this.state.playBismillah ? 1 : totalVerseNumber}.mp3`
    }
    let translationSRC = `https://everyayah.com/data/${translation}/${this.state.playBismillah ? "001001" : String(this.state.chapterNumber).padStart(3, '0')+String(this.state.verseNumber).padStart(3, '0')}.mp3`
    if (this.state.translationFormat === "audio") {
      translationSRC = `https://cdn.islamic.network/quran/audio/${highestBitrates[translation]}/${translation}/${this.state.playBismillah ? 1 : totalVerseNumber}.mp3`
    }
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'language' });

    let formatWordsByDiv = (text) => {
      let json = JSON.parse(text)
      return json.map(word => <div className='arabicWord' data-value={word["word_translation"]}>{word["word_arabic"]}</div>)
    }
    let formatWordByWord = (text, includeEnglish) => {
      let json = JSON.parse(text)
      if (includeEnglish) {
          return json.map(word => `${word["word_arabic"]} (${word["word_translation"]})`).join(' ')
        } 
        return json.map(word => `${word["word_arabic"]}`).join(' ')
    }

    let parseTajweed = new Tajweed()

    let tajweedWords = (tajweedText, translationText, includeEnglish) => {
      let tajweedWordsList = tajweedText.split(" ")
      let translated = JSON.parse(translationText)

      if (tajweedWordsList.length != translated.length) {
        return tajweedText
      }

      if (includeEnglish) {
        let tajweedSpans = []
        for (let i = 0; i < tajweedWordsList.length; i++) {
          let tajweedSpan = ''
          let translation = translated[i]["word_translation"]
          let descriptions = []
          let validDescriptionCount = 1;
          for (let j = 1; `(${this.state.chapterNumber}:${this.state.verseNumber}:${i+1}:${j})` in corpus; j++) {
            let description = getDescription(
              corpus[`(${this.state.chapterNumber}:${this.state.verseNumber}:${i+1}:${j})`]["TAG"],
              corpus[`(${this.state.chapterNumber}:${this.state.verseNumber}:${i+1}:${j})`]["FEATURES"])
            
            if (description) {
              description = description.trim()
              descriptions.push(`- ` + description)
              validDescriptionCount++;
            }
          }
          tajweedSpan = `<span class='arabicWord' data-value='${translation}' data-parent='${descriptions.join("\n")}'>${parseTajweed.parse(tajweedWordsList[i],true)}</span>`
          tajweedSpans.push(tajweedSpan)
        }
        return tajweedSpans.join(' ')
      } else {
        let tajweedSpans = []
        for (let i = 0; i < tajweedWordsList.length; i++) {
          let tajweedSpan = ''
          let translation = translated[i]["word_translation"]
          tajweedSpan = `<span class="arabicWord" data-value="${translation}" data-parent="${''}">${parseTajweed.parse(tajweedWordsList[i],true)}</span>`
          tajweedSpans.push(tajweedSpan)
        }
        return tajweedSpans.join(' ')
      }
    }

    // Parse corpus and get descriptions

    let options = (
      <div>
        {/* <p>Reciter:</p> */}
        <select value={this.state.reciter} onChange={(e)=> {this.setState({reciterName: e.target.selectedOptions[0].getAttribute('recitername'),reciter: e.target.value, format: e.target.selectedOptions[0].getAttribute('audioformat')}); }}>
        {
          reciters && reciters.map(option => <option key={option['identifier']} recitername={option['englishName']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
        }
        </select>
        {/* <p>Translation:</p> */}
        <select value={this.state.translation} onChange={(e)=> {  this.setState({translatorName: e.target.selectedOptions[0].getAttribute('translatorname'), translation: e.target.value, translationFormat: e.target.selectedOptions[0].getAttribute('audioformat')}); } }>
        {
          reciters && reciters.map(option => <option key={option['identifier']} translatorname={option['englishName']} audioformat={option['format']} value={option['identifier']}>{regionNamesInEnglish.of(option["language"])}: {option["englishName"]}</option> )
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
      </div>
    )

    return (
      <div>
        <Helmet>
          <title>{`Quran - ${this.state.surahName} - ${this.state.isTranslation ? this.state.translatorName : this.state.reciterName}`}</title>
          <meta name="description" content={`Quran - ${this.state.surahName} - ${this.state.isTranslation ? this.state.translatorName : this.state.reciterName}`}/>
          <link rel="canonical" href="http://itsjafer.com/#/parser" />
        </Helmet>

        {!this.state.fullscreen && <p>A Qur'an player that allows interlacing of Arabic and Non-Arabic translation audio. Also includes tajweed color-coding and word-by-word translations.</p>}
        
        <div className="Resume">
        
        {!this.state.fullscreen && options}

        <AudioPlayer
          autoPlay
          src={isTranslation ? translationSRC : arabicSRC}
          volume={1}
          onEnded={this.handleEnd}
          onError={this.handleEnd}
          onClickNext={this.skipAhead}
          onClickPrevious={this.skipPrevious}
          // Try other props!
        />
        <br/>
        <div className='translation'>
          <div className='subtitle' onClickCapture={() => this.setState({showTajweed: !this.state.showTajweed})}>
            {this.state.showTajweed ? "Tap here to hide grammar annotations" : "Tap here to show grammar annotations"}
          </div>
          {/* <div className='subtitle' onClickCapture={() => this.setState({fullscreen: !this.state.fullscreen})}>
            {!this.state.fullscreen ? "Tap to hide options" : "Tap to show options"}
          </div> */}

        {this.state.showTajweed ? 
        surahs[Number(this.state.chapterNumber) - 1] && 
        surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        <div dangerouslySetInnerHTML={{__html:
          tajweedWords(
            surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            true) }}></div> 
        : 
        surahs[Number(this.state.chapterNumber) - 1] && 
        surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1] && 
        surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1] && 
        <div dangerouslySetInnerHTML={{__html:
          tajweedWords(
            surahsTajweed[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            surahs[Number(this.state.chapterNumber) - 1]["ayahs"][this.state.verseNumber-1]["text"], 
            false) }}></div> 
        }
        </div>
        </div>
      </div>
    );
  }
}

export default Quran;
