from __future__ import annotations

from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

from game import Puzzle, generate_puzzle, normalize
from motor import Motor

DEFAULT_FOLDER = Path(__file__).parent / "Turkce-Kelime-Listesi"
_TURKISH_UPPER_MAP = str.maketrans({
    "i": "İ", "ı": "I", "ş": "Ş", "ç": "Ç", "ğ": "Ğ", "ü": "Ü", "ö": "Ö"
})

@st.cache_resource
def load_motor() -> Motor:
    # print("YÜKLENEN KELİME SAYISI:", len(motor.words if hasattr(motor, 'words') else "Bilinmiyor"))
    return Motor(DEFAULT_FOLDER)

def display_word(word: str) -> str:
    return word.translate(_TURKISH_UPPER_MAP).upper()

def initialize_state() -> None:
    if "motor" not in st.session_state:
        st.session_state.motor = load_motor()
        
    if "puzzle" not in st.session_state:
        puzzle = generate_puzzle(st.session_state.motor)
        st.session_state.puzzle = puzzle
        st.session_state.entered_words = [normalize(puzzle.start)]
        st.session_state.game_over = False
        st.session_state.error_msg = ""

def reset_game() -> None:
    puzzle = generate_puzzle(st.session_state.motor)
    st.session_state.puzzle = puzzle
    st.session_state.entered_words = [normalize(puzzle.start)]
    st.session_state.game_over = False
    st.session_state.error_msg = ""
    st.rerun()

# --- Sayfa Ayarları (Kompakt Mod) ---
st.set_page_config(page_title="Kelime Zinciri", page_icon="🧩", layout="centered")

# --- Ekranı Küçülten ve Odağı Koruyan CSS ---
st.markdown("""
    <style>
        /* Ana sayfa paddinglerini sıfırlayarak yukarı çekiyoruz */
        .block-container {
            padding-top: 1.5rem !important;
            padding-bottom: 0rem !important;
            max-width: 550px !important;
        }
        /* Başlıkları küçültüyoruz */
        h1 {
            font-size: 1.8rem !important;
            margin-bottom: 0.2rem !important;
            padding-bottom: 0rem !important;
        }
        h3 {
            font-size: 1.1rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.3rem !important;
        }
        /* Kutuları küçültüyoruz (Daha az yer kaplaması için) */
        .wordle-tile {
            display: inline-block;
            background-color: #f0f2f5;
            border: 2px solid #d3d6da;
            color: #1a1a1a;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1rem;
            padding: 4px 10px;
            margin: 2px;
            text-align: center;
            letter-spacing: 0.5px;
        }
        .wordle-tile-start {
            background-color: #4caf50;
            color: white;
            border-color: #4caf50;
        }
        .wordle-tile-target {
            background-color: #2196f3;
            color: white;
            border-color: #2196f3;
        }
        .chain-arrow {
            color: #888;
            font-weight: bold;
            font-size: 1rem;
            margin: 0 2px;
        }
        /* Çizgiler arası boşlukları daralt */
        hr {
            margin: 0.6rem 0 !important;
        }
        /* Input etiket alanını küçült */
        .stTextInput label {
            font-size: 0.9rem !important;
            padding-bottom: 0.2rem !important;
        }
    </style>
""", unsafe_allow_html=True)

initialize_state()

puzzle = st.session_state.puzzle
entered_words = st.session_state.entered_words
motor = st.session_state.motor

# --- BAŞLIK ---
st.title("🧩 Kelime Zinciri")
st.write("---")

# --- GÖREV KUTULARI (YAZI BOYUTLARI KÜÇÜLTÜLDÜ) ---
col1, col2 = st.columns(2)
with col1:
    st.markdown(f"**Başlangıç:** <span class='wordle-tile wordle-tile-start'>{display_word(puzzle.start)}</span>", unsafe_allow_html=True)
with col2:
    st.markdown(f"**Hedef:** <span class='wordle-tile wordle-tile-target'>{display_word(puzzle.target)}</span>", unsafe_allow_html=True)

# --- OYNANAN KELİMELER ---
st.subheader("🔗 Zincirin")

chain_html = ""
for i, word in enumerate(entered_words):
    if i == 0:
        chain_html += f"<span class='wordle-tile wordle-tile-start'>{display_word(word)}</span>"
    else:
        chain_html += f"<span class='chain-arrow'>→</span><span class='wordle-tile'>{display_word(word)}</span>"

st.markdown(f"<div>{chain_html}</div>", unsafe_allow_html=True)
st.write("---")

# --- GİRDİ ALANI ---
if not st.session_state.game_over:
    if st.session_state.error_msg:
        st.error(st.session_state.error_msg)
        
    # Form ve Input anahtarları artık sabit, böylece odaklanma kaybolmuyor
    with st.form(key="game_form", clear_on_submit=True):
        current_input = st.text_input(
            label=f"Sıradaki kelime '{display_word(entered_words[-1][-1])}' harfiyle başlamalı:",
            placeholder="Yazın ve Enter'a basın...",
            max_chars=20
        )
        submit_btn = st.form_submit_button("Kelimeyi Ekle", use_container_width=True)

    # --- KESİNTİSİZ ODAKLANMA (CONTINUOUS FOCUS) ---
    # Bu script sayfa her yüklendiğinde girdiyi yakalar ve odağı kaybetmez.
    components.html(
        """
        <script>
            function setFocus() {
                var parentDoc = window.parent.document;
                var input = parentDoc.querySelector('input[placeholder="Yazın ve Enter\'a basın..."]');
                if (input) {
                    input.focus();
                }
            }
            // Sayfa yüklenirken ve periyodik olarak kontrol et (Streamlit render akışını yakalamak için)
            setTimeout(setFocus, 50);
            setTimeout(setFocus, 150);
        </script>
        """,
        height=0,
    )

    if submit_btn and current_input:
        next_word = normalize(current_input)
        previous_word = entered_words[-1]
        
        if not next_word:
            st.session_state.error_msg = "Lütfen geçerli bir kelime girin."
            st.rerun()
        elif not motor.contains(next_word):
            st.session_state.error_msg = f"'{display_word(next_word)}' sözlükte bulunamadı!"
            st.rerun()
        elif next_word in entered_words:
            st.session_state.error_msg = f"'{display_word(next_word)}' kelimesini zaten kullandınız."
            st.rerun()
        elif next_word[0] != previous_word[-1]:
            st.session_state.error_msg = f"Kelime '{display_word(previous_word[-1])}' harfiyle başlamalı!"
            st.rerun()
        else:
            st.session_state.entered_words.append(next_word)
            st.session_state.error_msg = "" 
            
            if next_word[-1] == normalize(puzzle.target)[0]:
                st.session_state.game_over = True
            
            st.rerun()
else:
    st.balloons()
    st.success(f"🎉 Tebrikler! {len(entered_words)} kelimede hedefe ulaştın.")
    
    if st.button("Yeni Oyuna Başla 🔄", type="primary", use_container_width=True):
        reset_game()