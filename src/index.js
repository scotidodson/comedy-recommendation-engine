// variables
let ratings = []
let comedians = ["Mike Birbiglia", "John Mulaney", "Pete Holmes",
"Nick Kroll", "Aparna Nancherla", "Chris Rock", "Sarah Silverman",
"Ali Wong", "Iliza Shlesinger", "Wyatt Cenac", "Tom Segura","Marc Maron",
"Moshe Kasher", "Chris Gethard", "Hasan Minhaj", "Hannibal Buress"]

// generating data
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
for (var i = 0; i < 100; i++) {
  ratings[i] = {
    user_id: i,
    "Mike Birbiglia": getRandomIntInclusive(1, 5),
    "John Mulaney": getRandomIntInclusive(1, 5),
    "Pete Holmes": getRandomIntInclusive(1, 5),
    "Nick Kroll": getRandomIntInclusive(1, 5),
    "Aparna Nancherla": getRandomIntInclusive(1, 5),
    "Chris Rock": getRandomIntInclusive(1, 5),
    "Sarah Silverman": getRandomIntInclusive(1, 5),
    "Ali Wong": getRandomIntInclusive(1, 5),
    "Iliza Shlesinger": getRandomIntInclusive(1, 5),
    "Wyatt Cenac": getRandomIntInclusive(1, 5),
    "Tom Segura": getRandomIntInclusive(1, 5),
    "Marc Maron": getRandomIntInclusive(1, 5),
    "Moshe Kasher": getRandomIntInclusive(1, 5),
    "Chris Gethard": getRandomIntInclusive(1, 5),
    "Hasan Minhaj": getRandomIntInclusive(1, 5),
    "Hannibal Buress": getRandomIntInclusive(1, 5)
  }
}


// let's do this
document.addEventListener('DOMContentLoaded', () => {
  const comedianForm = document.querySelector('#comedian-form')
  const results = document.querySelector('.results')

  // listening for submission, saving values in array
  // send to findNearestNeighbors()
  comedianForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let respArray = Array.from(event.target.querySelectorAll('select'))
    let newUserRatings = {}

    // create object out of submission values -- each comedian has score or null
    respArray.map(x=> {
      if (x.value !== "unsure") {
        newUserRatings[x.name] = Number(x.value)
      } else {
        newUserRatings[x.name] = null
      }
    })

    // send the submission off to find the k nearest neighbors
    findNearestNeighbors(newUserRatings)
  })


  function findNearestNeighbors(newUserRatings) {
    // find the euclidian distance between the new user ratings and each existing dataset
    for (var i = 0; i < ratings.length; i++) {
      ratings[i].simScore = findEuclidianDistance(newUserRatings, i)
    }

    // sort scores by values
    ratings.sort((a, b) => {
      let score1 = a.simScore
      let score2 = b.simScore
      return score2 - score1
      });

    // find the 5 highest values -- the nearest neighbors!
    let k = 5
    let nearestNeighbors = []
    for (var x = 0; x < k; x++) {
      nearestNeighbors.push(ratings[x])
    }
    console.log(nearestNeighbors);
    recommendNewComedians(nearestNeighbors, newUserRatings)
  }

  function findEuclidianDistance(newUserRatings, existingUserId) {
    // calculating euclidian distance between submission data and one existing set
    let userRatings1 = newUserRatings
    let userRatings2 = ratings[existingUserId]
    let diff = 0
    let sumDiffsSq = 0
    let simScore = 0

    for (var i = 0; i < comedians.length; i++) {
      let name = comedians[i]

      // for each non-null score, we will compute the difference between the
      // two user's scores and add the squared value of all differences
      if (userRatings1[name] != null && userRatings2[name] != null) {
        diff = userRatings1[name] - userRatings2[name]
        sumDiffsSq += (diff * diff)
      }
    }
    // we find the root of the sum, a calculation representing
    // the distance between the data sets
    let rootOfSum = Math.sqrt(sumDiffsSq)

    // transform all similarity scores to fit the range of 0 to 1
    simScore = 1/(1+ rootOfSum)
    return simScore.toFixed(4)
  }

  function recommendNewComedians(nearestNeighbors, newUserRatings) {
    let recs = []

    // average comedian score predictions based on nearest neighbors
    for (var i = 0; i < comedians.length; i++) {
      let name = comedians[i]
      let sum = 0
      if (newUserRatings[name] === null) {
        nearestNeighbors.forEach(neighbor => {
            sum+= Number(neighbor[name])
          })
        recs[i] = {}
        recs[i][name] = sum/5
      }
    }
    recs.sort((a, b) => {
      let score1 = Object.values(a)[0]
      let score2 = Object.values(b)[0]
      return score2 - score1
      });

    let topRecs = recs.splice(0,5).map(x=>{
      return `<p>${Object.keys(x)[0]} -- Expected Rating
                ${Object.values(x)[0].toFixed(1)}</p>`
    })

    results.innerHTML = `
      <h2>Your Recommendations</h2>
      ${topRecs.join(' ')}
    `
    return topRecs
  }
















})
