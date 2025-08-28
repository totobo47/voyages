<!-- <template>
  <div class="premiere-section h-100" style="overflow: hidden">

    <div v-if="!estQuizFini">
      <div v-if="!estMdpRentre">
        <InputText v-model="mdp" placeholder="Mdp" @change="verifierQuestions" />
      </div>
      <div v-else>
        <div>{{ questionAAfficher.Image }}</div>
        <h2>{{ questionAAfficher.Title }}</h2>
        <div v-if="!questionAAfficher.estRepondu">
          <p>{{ questionAAfficher.Description }}</p>
          <div v-if="questionAAfficher.Type == 1">
            <div class="card" @click="choisirReponse(questionAAfficher.Id, questionAAfficher.Type, 1)">Vrai</div>
            <div class="card" @click="choisirReponse(questionAAfficher.Id, questionAAfficher.Type, 0)">Faux</div>
          </div>
          <div v-if="questionAAfficher.Type == 2">
            <span v-for="(reponse, indexReponse) in questionAAfficher.Responses" :key="indexReponse" @click="choisirReponse(questionAAfficher.Id, questionAAfficher.Type, reponse.Code)">
              <div class="card">{{ reponse.Libelle }}</div>
            </span>
          </div>
        </div>
        <div v-else>
          <p>{{ questionAAfficher.Histoire }}</p>
          <p>{{ questionAAfficher.Anecdote }}</p>

          <div>
            <button @click="PasserQuestionSuivante()">Question suivante</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Quiz terminé.
      Veuillez recopier cette string et l'envoyer à Thomas : {{ resultat }}
      <p>{{ resultatDecode }}</p>
    </div>
  </div>
</template> -->

<template>
  <div class="quiz-container h-100" style="overflow: hidden">
    <div v-if="!isAllowed" class="blocked">
      <h2>{{ errorMsg }}</h2>
      <a v-if="errorMsg.includes('Chrome')" href="https://www.google.com/chrome/" target="_blank"> Télécharger Google Chrome </a>
    </div>

    <div v-else>
      <div v-if="!estQuizFini">
        <div v-if="!estMdpRentre || !estMdpOK">
          <InputText v-model="mdp" placeholder="Mdp" @change="verifierQuestions" />
          <div v-if="!estMdpOK">Le mot de passe est incorrect !</div>
        </div>
        <div v-else>
          <div>
            <!-- <img :src="questionAAfficher.image" alt="Illustration" class="question-image" /> -->

            <h1 class="question-title">{{ questionAAfficher.titre }}</h1>
            <p class="question-text">{{ questionAAfficher.description }}</p>

            <div class="answers">
              <div v-if="questionAAfficher.type == 1">
                <div class="card" @click="choisirReponse(1)">Vrai</div>
                <div class="card" @click="choisirReponse(0)">Faux</div>
              </div>
              <div v-if="questionAAfficher.type == 2">
                <button
                  v-for="(answer, i) in questionAAfficher.reponses"
                  :key="i"
                  :class="[
                    'answer-btn',
                    {
                      correct: questionAAfficher.estRepondu && answer.id === bonneReponse.id,
                      wrong: questionAAfficher.estRepondu && reponseChoisi.id === answer.id && answer.id !== bonneReponse.id,
                    },
                  ]"
                  @click="choisirReponse(answer.id)"
                >
                  {{ answer.libelle }}
                </button>
              </div>
            </div>

            <div v-if="questionAAfficher.estRepondu" class="feedback-section">
              <p class="feedback-result">
                <span v-if="reponseChoisi.id === bonneReponse.id" class="correct-text">✅ Correct !</span>
                <span v-else class="wrong-text">❌ Incorrect ! La bonne réponse était : {{ bonneReponse.libelle }}</span>
              </p>
              <p class="story"><strong>Histoire :</strong> {{ questionAAfficher.histoire }}</p>
              <p class="anecdote"><strong>Anecdote :</strong> {{ questionAAfficher.anecdote }}</p>

              <button class="next-btn" @click="PasserQuestionSuivante()">Question suivante</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        Quiz terminé.
        <p>
          Veuillez recopier cette string et l'envoyer à Thomas : <strong>{{ resultat }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

var estMdpRentre = ref(false);
var estMdpOK = ref(true);
var estQuizFini = ref(false);
var mdp = ref();
var questions = ref([]);
var questionsAAfficher = ref([]);
var questionAAfficher = ref({});
var reponseChoisi = ref({});
var bonneReponse = ref({});

var resultat = ref("");
const resultatDecode = computed(() => {
  try {
    return decodeURIComponent(escape(atob(resultat.value)));
  } catch (e) {
    return "Erreur décodage";
  }
});

onMounted(() => {
  recupereData();
});

function verifierQuestions() {
  estMdpOK.value = false;

  questionsAAfficher.value = questions.value.filter((x) => x.mdp?.toUpperCase() == mdp.value?.toUpperCase());

  if (questionsAAfficher.value.length > 0) {
    estMdpOK.value = true;

    PasserQuestionSuivante();
  }
  estMdpRentre.value = true;
}

function choisirReponse(reponseId) {
  if (reponseChoisi.value != null) return;

  if (questionAAfficher.value.reponses == null || questionAAfficher.value.reponses.length == 0) return;

  reponseChoisi.value = questionAAfficher.value.reponses.find((r) => r.id === reponseId);

  var tmpRes = btoa(unescape(encodeURIComponent(resultatDecode.value + questionAAfficher.value.type + questionAAfficher.value.id + ":" + reponseId + ";")));
  resultat.value = tmpRes;
  questionAAfficher.value.estRepondu = true;
}

function PasserQuestionSuivante() {
  if (questionsAAfficher.value.length == 0) estQuizFini.value = true;
  else {
    reponseChoisi.value = null;

    questionAAfficher.value = questionsAAfficher.value[0];
    questionsAAfficher.value.shift();
    questionAAfficher.value.estRepondu = false;

    if (questionAAfficher.value.reponses != null) {
      if (questionAAfficher.value.reponses.length == 0) bonneReponse.value = questionAAfficher.value.reponse == 1;
      else bonneReponse.value = questionAAfficher.value.reponses.find((r) => r.id === questionAAfficher.value.reponse);
    }
  }
}

function recupereData() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      questions.value = data;
    });
}


const isAllowed = ref(true);
const errorMsg = ref("");

// Détection Chrome uniquement
function isChromeBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  console.log(ua)
  return ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr");
}

// Détection navigation privée (test IndexedDB + quota stockage)
async function isPrivateMode() {
  try {
    // Test IndexedDB
    await indexedDB.open("test");
  } catch (e) {
    return true;
  }

  // Test quota
  if (navigator.storage && navigator.storage.estimate) {
    const { quota } = await navigator.storage.estimate();
    console.log("quota", quota)
    if (quota < 1000000000) {
      // Souvent très bas en mode privé
      return true;
    }
  }
  return false;
}

// Vérifie si l’URL contient bypass=1
function hasBypass() {
  const params = new URLSearchParams(window.location.search);
  return params.get("bypass") === "1";
}


onMounted(async () => {
  if (hasBypass()) {
    isAllowed.value = true;
    return;
  }

  // Vérifie si c'est un mobile
  const isMobile = /android|iphone|ipad|ipod/.test(ua)


  if (!(isChromeBrowser() && isMobile)) {
    isAllowed.value = false;
    errorMsg.value = "🚫 Ce quiz fonctionne uniquement sur Google Chrome.";
    return;
  }

  if (await isPrivateMode()) {
    isAllowed.value = false;
    errorMsg.value = "🚫 La navigation privée est désactivée. Merci d’utiliser une fenêtre normale.";
    return;
  }
});
</script>
<style scoped>
.quiz-container {
  max-width: 700px;
  margin: 40px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

.question-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
  object-fit: cover;
}

.question-title {
  color: #4a90e2;
  margin-bottom: 10px;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
}

.answers {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.answer-btn {
  flex: 1 1 calc(45% - 15px);
  padding: 12px 20px;
  margin: 1%;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.answer-btn:hover {
  background-color: #4a90e2;
  color: white;
}

.answer-btn.correct {
  background-color: #2ecc71;
  color: white;
  border-color: #27ae60;
}

.answer-btn.wrong {
  background-color: #ff6f61;
  color: white;
  border-color: #e74c3c;
}

.feedback-section {
  margin-top: 20px;
  text-align: left;
  background-color: #f4f4f4;
  padding: 15px 20px;
  border-radius: 10px;
}

.feedback-result {
  font-weight: bold;
  margin-bottom: 10px;
}

.correct-text {
  color: #2ecc71;
}

.wrong-text {
  color: #e74c3c;
}

.story,
.anecdote {
  margin-bottom: 8px;
}

.next-btn {
  margin-top: 10px;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.next-btn:hover {
  background-color: #357abd;
}
</style>
