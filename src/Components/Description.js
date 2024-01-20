let nouns = [
    ['PCPL', ' participle'],
    ['VN', ' verbal noun']
]

let mood = [
    ['MOOD:SUBJ', ' subjunctive mood'],
    ['MOOD:JUS', ' jussive mood']
]

function getMood(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        mood.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1] + "\n"
            }
        })
    })
    return ret
}

function getNoun(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        nouns.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1]
            }
        })
    })
    return ret 
}

let voice = [
    ['ACT', ' active'],
    ['PASS', ' passive']
]
function getVoice(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        voice.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1] + "\n"
            }
        })
    })
    return ret
}

let _case = [
    ['GEN', ' genitive (المجرور)'],
    ['NOM', ' nominative (المرفوع)'],
    ['ACC', ' accusative (المنصوب)'],
    ['IMPF', ' imperfect (المضارع)'],
    ['PERF', ' perfect (الماضي)'],
    ['IMPV', ' imperative (الأَمْر)']
]

let _roots = {
    // Uppercase
    'A': 'أ',
    'B': 'ب',
    'D': 'ض',
    'E': 'ع',
    'F': 'ف',
    'G': 'غ',
    'H': 'ح',
    'S': 'ص',
    'T': 'ط',
    'Z': 'ظ', 

    // Lowercase 
    'a': 'ا',
    'b': 'ب',
    'd': 'د',
    'f': 'ف',
    'g': 'غ',
    'h': 'ه',
    'j': 'ج',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'q': 'ق',
    'r': 'ر',
    's': 'س',
    't': 'ت',
    'v': 'ث',
    'w': 'و',
    'x': 'خ',
    'y': 'ي',
    'z': 'ز', 
    '$': 'ش',
    '*': 'ذ',
};

function getRoot(str) {
    let ret = ""
    str.forEach(elem => {
        if(elem.split(':')[0] == 'ROOT') {
            let root = elem.split(':')[1]
            // For each character in the root, map it to the equivalent Arabic
            for (let i = 0; i < root.length; i++) {
                ret += _roots[root.charAt(i)] + " "
            }
        }
    })
    return "Root: " + ret + "\n"
}

function getCase(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        _case.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1]
            }
        })
    })
    return ret
}

let gender = [
    ['M', ' masculine'],
    ['MP', ' masculine plural'],
    ['F', ' feminine'],
    ['FS', ' feminine singular'],
    ['FP', ' feminine plural'],
    ['MS', ' masculine singular'],
    ['FD', ' feminine dual'],
    ['MD', ' masculine dual'],
    ['P', ' plural']
]

function getGender(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        gender.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1] + "\n"
            }
        })
    })
    return ret
}

function abr(str) {
    if (str == 'l') {
        return 'lām'
    }
    if(str == 'ka') {
        return str
    }
    if (str == 'bi') {
        return 'bi'
    }
    if(str == 'w') {
        return 'wa (oath)'
    }
    if(str == 'ta') {
        return 'ta (oath)'
    }
}

let forms = [
    ['(X)', ' (form X) (اِسْتِفْعَال)'],
    ['(IV)', ' (form IV) (إِفْعَال)'],
    ['(VIII)', ' (form VIII) (اِفْتِعَال)'],
    ['(III)', ' (form III) (فِعَال/ٌمُفَاعَلَة)'],
    ['(II)', ' (form II) (تَفْعِيْل/تَفْعِلَة)'],
    ['(VI)', ' (form VI) (تَفَاعُل)'],
    ['(V)', ' (form V) (تَفَعّل)'],
    ['(VII)', ' (form VII) (اِنْفِعَالٌ)'],
    ['(XII)', ' (form XII)'],
    ['(IX)', ' (form IX) (اِفْعِللٌ)'],
    ['(XI)', ' (form XI)']
]

function getForm(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        forms.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1] + "\n"
            }
        })
    })
    if (ret.length === 0) {
        return "(form I) \n"
    }
    return ret
}

let pron = [
    ['2MS', ' 2nd person masculine singular'],
    ['1P', ' 1st person plural'],
    ['3MP', ' 3rd person masculine plural'],
    ['3MS', ' 3rd person masculine singular'],
    ['2MP', ' 2nd person masculine plural'],
    ['3FS', ' 3rd person feminine singular'],
    ['3FP', ' 3rd person feminine plural'],
    ['1S', ' 1st person singular'],
    ['2D', ' 2nd person dual'],
    ['3D', ' 3rd person dual'],
    ['2MD', ' 2nd person masculine dual'],
    ['3FD', ' 3rd person feminine dual'],
    ['2FS', ' 3rd person feminine singular'],
    ['2FP', ' 2nd person feminine plural'],
    ['2FD', ' 2nd person feminine dual']
]

function pronoun(str) {
    let ret = ''
    str.forEach(elem => {
        let check = elem
        if(elem.split(':')[0] == 'PRON') {
            check = elem.split(':')[1]
        }
        pron.forEach(elem1 => {
            if(elem1[0] == check) {
                ret = elem1[1] + "\n"
            }
        })
    })
    return ret
}

const getDescription = (tag, desc) => {

    let str = ""

    if(tag == 'N') {
        let tags = desc.split('|')
        let str = ''
        str += pronoun(tags)
        str += getCase(tags)
        str +=  getGender(tags)
        if(tags.includes('INDEF')) {
            str += ' indefinite \n'
        }
        str += getRoot(tags)
        str += getForm(tags)
        str += getVoice(tags)
        let n = getNoun(tags)
        if (n != '') {
            str += n + '&#xa;'
        } else {
            str += ' noun&#xa;'
        }
        return str
    }

    if ( tag == 'INL') {
        let str ='Quranic Initials &#xa;'

        return str
    }

    
    if ( tag == 'REM') {
        let str =''
        let tags = desc.split('|')
        if(tags[0]== 'PREFIX') {
            str = 'Prefixed resumption particle &#xa;'
        }
        else {
            str = 'Resumption particle &#xa;'
        }
        return str
    }
    
    
    if ( tag == 'ACC') {

        
        let str ='Accusative particle &#xa;'

        return str
    }
    
    
    if ( tag == 'EQ') {
        let str ='prefixed equalization particle &#xa;'

        return str
    }
    
    
    if ( tag == 'CIRC') {
        let str ='prefixed circumstantial particle &#xa;'

        return str
    }
    
    
    if ( tag == 'RES') {
        let str ='restriction particle &#xa;'

        return str
    }
    
    
    if ( tag == 'PRO') {
        let str ='prohibition particle &#xa;'

        return str
    }
    
    
    if ( tag == 'PREV') {

        let tags = desc.split('|')

        let str =' preventive particle mā&#xa;';
        return str
    }
    
    
    if ( tag == 'INC') {
        let str ='inceptive particle &#xa;'

        return str
    }
    
    
    if ( tag == 'AMD') {
        let str ='amendment particle &#xa;'

        return str
    }
    
    
    if ( tag == 'SUB') {
        let str ='subordinating conjunction &#xa;'

        return str
    }
    
    
    if ( tag == 'EMPH') {

        let tags = desc.split('|')
        let str =''
        function getEmph(emph) {
            if (emph == 'n') {
                return 'nūn'
            }
            if (emph == 'l') {
                return 'lām'
            }
        }
        if (tags[0] == 'PREFIX') {
            str = 'emphatic prefix ' +
                    getEmph(tags[tags.length-1][0]) + '&#xa;'
        }
        else {
            str = 'emphatic suffix ' +
                    getEmph(tags[tags.length-1].split(':')[0].replace('+', '')) + '&#xa;'
        }
        return str
    }
    
    
    if ( tag == 'VOC') {
        let tags = desc.split('|')
        let str =''

        if (tags[0] == 'PREFIX') {
            str = 'vocative prefix ' +
                    tags[tags.length-1].replace('+', '') + '&#xa;'
        }
        else {
            str = 'vocative suffix &#xa;'
        }
        
        return str
    }
    
    
    if ( tag == 'RSLT') {
        let str ='prefixed result particle &#xa;'

        return str
    }
    
    
    if ( tag == 'EXL') {
        let str ='explanation particle &#xa;'

        return str
    }
    
    
    if ( tag == 'EXP') {
        let str ='exceptive particle &#xa;'

        return str
    }
    
    
    if ( tag == 'CAUS') {
        let str ='prefixed particle of cause &#xa;'

        return str
    }
    
    
    if ( tag == 'CERT') {
        let str ='particle of certainty &#xa;'

        return str
    }
    
    
    if ( tag == 'PRP') {
        let str ='prefixed particle of purpose lām &#xa;'

        return str
    }
    
    
    if ( tag == 'ANS') {
        let str ='answer particle &#xa;'

        return str
    }
    
    
    if ( tag == 'RET') {
        let str ='retraction particle &#xa;'

        return str
    }
    
    
    if ( tag == 'P') {
        let str =''
        let tags = desc.split('|')
        if(tags.length == 3) {
            str = 'preposition &#xa;'
        }
        if(tags.length == 2) {
            let abrInput
            if(tags[1].split(':').length == 2) {
                abrInput = tags[1].split(':')[0]
            }
            else {
                abrInput = tags[1].replace('+', '')
            }
            if (tags[0] == 'PREFIX') {
                
                str = 'prefixed preposition ' + 
                    abr(abrInput) + 
                    '&#xa;'
            }
            if (tags[0] == 'SUFFIX') {
                str = 'suffixed preposition '+
                    abr(abrInput) + 
                    '&#xa;'
            }
        }

        return str
    }
    
    
    if ( tag == 'EXH') {
        let str ='exhortation particle &#xa;'

        return str
    }
    
    
    if ( tag == 'INT') {
        let str ='particle of interpretation &#xa;'

        return str
    }
    
    
    if ( tag == 'IMPV') {
        let str ='prefixed imperative particle lām &#xa;'

        return str
    }
    
    
    if ( tag == 'COM') {
        let str ='prefixed comitative particle &#xa;'

        return str
    }
    
    
    if ( tag == 'SUR') {
        let str ='surprise particle &#xa;'

        return str
    }
    
    
    if ( tag == 'AVR') {
        let str ='aversion particle &#xa;'

        return str
    }
    
    
    if ( tag == 'PRON') {
        let tags = desc.split('|')
        let str = pronoun(tags) + ' pronoun &#xa;'
        return str
    }
    
    
    if ( tag == 'IMPN') {
        let str ='imperative verbal noun &#xa;'

        return str
    }
    
    
    if ( tag == 'FUT') {

        let str =''
        let tags = desc.split('|')
        if(tags.length == 2) {
            str = 'prefixed future particle &#xa;'
        }
        else {
            str = 'future particle &#xa;'
        }
        return str
    }
    
    
    if ( tag == 'COND') {
        let str =''
        let tags = desc.split('|')
        if (tags.length == 3) {
            str = 'conditional particle &#xa;'
        }
        else {
            str = getGender(tags) + ' conditional noun &#xa;'
        }

        return str
    }
    
    
    if ( tag == 'LOC') {

        let tags = desc.split('|')
        let str = ''
        str += getCase(tags)
        str +=  getGender(tags)
        str += getVoice(tags)
        let n = getNoun(tags)
        if (n != '') {
            str += n + '&#xa;'
        } else {
            str += ' location adverb&#xa;'
        }

        
        return str
    }
    
    
    if ( tag == 'INTG') {
        let str =''
        let tags = desc.split('|')
        if(tags.length == 2 ) {
            str = ' prefixed interrogative alif &#xa;'
        } else {
            str += getCase(tags) + ' interrogative noun&#xa;'
        }
        return str
    }
    
    
    if ( tag == 'SUP') {
        let str =''
        let tags = desc.split('|')
        if(tags.length == 2 ) {
            str = ' prefixed supplemental particle &#xa;'
        } else {
            str += ' supplemental particle&#xa;'
        }
        return str
    }
    
    
    if ( tag == 'T') {
        let tags = desc.split('|')
        let str = ''
        str += getCase(tags)
        str +=  getGender(tags)
        if(tags.includes('INDEF')) {
            str += ' indefinite \n'
        }
        str += ' time adverb&#xa;'     
        return str
    }
    
    
    if ( tag == 'DEM') {
        let tags = desc.split('|')
        let str =  getGender(tags) + ' demonstrative pronoun &#xa;'
        return str
    }
    
    
    if ( tag == 'NEG') {
        let str =' negative particle &#xa;'

        return str
    }
    
    
    if ( tag == 'REL') {
        let tags = desc.split('|')
        let str =  getGender(tags) + ' relative pronoun &#xa;'

        return str
    }
    
    
    if ( tag == 'CONJ') {
        let tags = desc.split('|')
        if(tags.length == 3) {
            str = ' coordinating conjunction &#xa;'
        }
        if(desc == 'PREFIX|f:CONJ+') {
            str = ' prefixed conjunction fa (and) &#xa;'
        }
        if (desc == 'PREFIX|w:CONJ+') {
            str = ' prefixed conjunction wa (and) &#xa;'
        }

        return str
    }
    
    
    if ( tag == 'V') {
        let str =''
        let tags = desc.split('|')
        str += pronoun(tags)
        str += getVoice(tags)
        str += getRoot(tags)
        str += getForm(tags)
        str += getCase(tags)
        let m = getMood(tags)
        if(m != '') {
            str += ' verb, ' + m + '&#xa;'
        }
        else {
            str += ' verb&#xa;'
        }

        return str
    }
    
    
    if ( tag == 'ADJ') {
        let tags = desc.split('|')
        let str = ''
        str += pronoun(tags)
        str += getCase(tags)
        str +=  getGender(tags)
        if(tags.includes('INDEF')) {
            str += ' indefinite \n'
        }
        str += getRoot(tags)
        str += getForm(tags)
        str += getVoice(tags)
        let n = getNoun(tags)
        if (n != '') {
            str += n + '&#xa;'
        } else {
            str += ' adjective&#xa;'
        }
        return str
    }
    
    if(tag == 'PN') {
        let tags = desc.split('|')
        let str = ''
        str += pronoun(tags)
        str += getCase(tags)
        str +=  getGender(tags)
        if(tags.includes('INDEF')) {
            str += ' indefinite \n'
        }
        str += getRoot(tags)
        str += getForm(tags)
        str += getVoice(tags)
        let n = getNoun(tags)
        if (n != '') {
            str += n + '&#xa;'
        } else {
            str += ' proper noun&#xa;'
        }
        return str
    }
}


export default getDescription