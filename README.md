# Kelime Oyunu

Bu repo iki arayüz içerir:

- React + Vite UI: `web-game`
- Streamlit UI: `streamlit_app.py`

## Yerelde çalıştırma

### React UI

```bash
cd web-game
npm install
npm run dev
```

### Streamlit UI

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Private GitHub repositoryye yükleme

1. GitHub'da yeni bir repository oluşturun ve `Private` seçin.
2. Bu klasörde Git başlatın:

```bash
git init
```

3. Dosyaları ekleyip ilk commit'i alın:

```bash
git add .
git commit -m "Initial commit"
```

4. GitHub remote ekleyin:

```bash
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
```

5. Push edin:

```bash
git branch -M main
git push -u origin main
```

## Yayınlama önerisi

- React UI için: Vercel, Netlify veya Cloudflare Pages
- Streamlit UI için: Streamlit Community Cloud

İki arayüz aynı oyun mantığını paylaşır. React UI tarayıcı tabanlıdır, Streamlit UI ise Python tarafında aynı motoru kullanır.
