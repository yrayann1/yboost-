/* index.js */
const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');


// Les variables utilisees dans le programme
const app = express();
const PORT = process.env.PORT || 3003;

const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getPokemonExtraStats = (pokemon) => {
    const attack = clamp(Math.round((pokemon.power || 0) * 1.6 + (pokemon.cp || 0) * 2.5), 15, 99);
    const defense = clamp(Math.round((pokemon.hp || 0) * 1.25 + (pokemon.cp || 0) * 2 + (pokemon.types?.length || 1) * 2), 15, 99);
    const speed = clamp(Math.round((pokemon.power || 0) * 1.2 + 40 - (pokemon.hp || 0) * 0.35), 15, 99);

    let rarity = 'Commun';
    if ((pokemon.power || 0) >= 40) rarity = 'Légendaire';
    else if ((pokemon.power || 0) >= 34) rarity = 'Épique';
    else if ((pokemon.power || 0) >= 28) rarity = 'Rare';

    return { attack, defense, speed, rarity };
};

const TYPE_WEAKNESSES = {
    Plante: ['Feu', 'Glace', 'Vol', 'Insecte'],
    Feu: ['Eau', 'Roche', 'Sol'],
    Eau: ['Electrik', 'Plante'],
    Electrik: ['Sol'],
    Psy: ['Insecte', 'Spectre', 'Ténèbres'],
    Poison: ['Sol', 'Psy'],
    Insecte: ['Feu', 'Vol', 'Roche'],
    Roche: ['Eau', 'Plante', 'Combat', 'Sol', 'Acier'],
    Sol: ['Eau', 'Plante', 'Glace'],
    Vol: ['Electrik', 'Glace', 'Roche'],
    Combat: ['Vol', 'Psy', 'Fée'],
    Fée: ['Poison', 'Acier'],
    Acier: ['Feu', 'Combat', 'Sol'],
    Normal: ['Combat'],
    Dragon: ['Glace', 'Dragon', 'Fée']
};

const TYPE_RESISTANCES = {
    Plante: ['Eau', 'Electrik', 'Plante', 'Sol'],
    Feu: ['Feu', 'Plante', 'Glace', 'Insecte', 'Acier', 'Fée'],
    Eau: ['Feu', 'Eau', 'Glace', 'Acier'],
    Electrik: ['Electrik', 'Vol', 'Acier'],
    Psy: ['Combat', 'Psy'],
    Poison: ['Plante', 'Combat', 'Poison', 'Insecte', 'Fée'],
    Insecte: ['Plante', 'Combat', 'Sol'],
    Roche: ['Normal', 'Feu', 'Poison', 'Vol'],
    Sol: ['Poison', 'Roche'],
    Vol: ['Plante', 'Combat', 'Insecte'],
    Combat: ['Roche', 'Insecte', 'Ténèbres'],
    Fée: ['Combat', 'Insecte', 'Ténèbres'],
    Acier: ['Normal', 'Plante', 'Glace', 'Vol', 'Psy', 'Insecte', 'Roche', 'Dragon', 'Acier', 'Fée'],
    Normal: [],
    Dragon: ['Feu', 'Eau', 'Plante', 'Electrik']
};

const TYPE_TALENTS = {
    Plante: ['Engrais', 'Chlorophylle'],
    Feu: ['Brasier', 'Corps Ardent'],
    Eau: ['Torrent', 'Glissade'],
    Electrik: ['Statik', 'Paratonnerre'],
    Psy: ['Synchro', 'Lévitation'],
    Poison: ['Point Poison', 'Mue'],
    Insecte: ['Essaim', 'Poudreur'],
    Roche: ['Tête de Roc', 'Fermeté'],
    Sol: ['Voile Sable', 'Force Sable'],
    Vol: ['Regard Vif', 'Pieds Confus'],
    Combat: ['Cran', 'Impassible'],
    Fée: ['Joli Sourire', 'Peau Féérique'],
    Acier: ['Magnépiège', 'Corps Sain'],
    Normal: ['Fuite', 'Attention'],
    Dragon: ['Mue', 'Attention']
};

const EVOLUTION_CHAINS = {
    Bulbizarre: 'Bulbizarre -> Herbizarre -> Florizarre',
    Salamèche: 'Salamèche -> Reptincel -> Dracaufeu',
    Carapuce: 'Carapuce -> Carabaffe -> Tortank',
    Aspicot: 'Aspicot -> Coconfort -> Dardargnan',
    Roucool: 'Roucool -> Roucoups -> Roucarnage',
    Rattata: 'Rattata -> Rattatac',
    Piafabec: 'Piafabec -> Rapasdepic',
    Abo: 'Abo -> Arbok',
    Pikachu: 'Pichu -> Pikachu -> Raichu',
    Sabelette: 'Sabelette -> Sablaireau',
    Mélofée: 'Mélo -> Mélofée -> Mélodelfe',
    Groupix: 'Goupix -> Feunard',
    Nosferapti: 'Nosferapti -> Nosferalto -> Nostenfer',
    Miaouss: 'Miaouss -> Persian',
    Psykokwak: 'Psykokwak -> Akwakwak',
    Caninos: 'Caninos -> Arcanin',
    Ptitard: 'Ptitard -> Têtarte -> Tartard',
    Abra: 'Abra -> Kadabra -> Alakazam',
    Machoc: 'Machoc -> Machopeur -> Mackogneur',
    Chétiflor: 'Chétiflor -> Boustiflor -> Empiflor',
    Tentacool: 'Tentacool -> Tentacruel',
    Racaillou: 'Racaillou -> Gravalanch -> Grolem',
    Ponyta: 'Ponyta -> Galopa',
    Ramoloss: 'Ramoloss -> Flagadoss',
    Magnéti: 'Magnéti -> Magnéton -> Magnézone',
    Canarticho: 'Canarticho (forme unique)',
    Otaria: 'Otaria -> Lamantine',
    Krabby: 'Krabby -> Krabboss',
    Voltorbe: 'Voltorbe -> Électrode',
    Kokiyas: 'Kokiyas -> Crustabri',
    Evoli: 'Évoli -> Aquali / Voltali / Pyroli / etc.',
    Minidraco: 'Minidraco -> Draco -> Dracolosse',
    Mew: 'Mew (Pokémon fabuleux)'
};

const getPokemonFullInfo = (pokemon) => {
    const firstType = pokemon.types[0] || 'Normal';
    const secondType = pokemon.types[1] || null;
    const extra = getPokemonExtraStats(pokemon);
    const weaknesses = [...new Set(pokemon.types.flatMap((type) => TYPE_WEAKNESSES[type] || []))].slice(0, 5);
    const resistances = [...new Set(pokemon.types.flatMap((type) => TYPE_RESISTANCES[type] || []))].slice(0, 6);
    const talentPool = [
        ...(TYPE_TALENTS[firstType] || ['Adaptation']),
        ...(secondType ? (TYPE_TALENTS[secondType] || []) : [])
    ];
    const talents = [...new Set(talentPool)].slice(0, 3);

    return {
        taille: `${(0.4 + pokemon.hp / 22).toFixed(2)} m`,
        poids: `${(4.8 + pokemon.power * 0.85 + pokemon.cp * 0.35).toFixed(1)} kg`,
        generation: 'Génération I',
        region: 'Kanto',
        categorie: `Pokémon ${firstType.toLowerCase()}`,
        talents,
        faiblesses: weaknesses.length ? weaknesses : ['Aucune notable'],
        resistances: resistances.length ? resistances : ['Aucune notable'],
        evolution: EVOLUTION_CHAINS[pokemon.name] || `${pokemon.name} (évolution inconnue)`,
        capture: `${clamp(65 - pokemon.power, 8, 60)}%`,
        description: `${pokemon.name} est un Pokémon de type ${pokemon.types.join(' / ')}. Il se distingue par une puissance de ${pokemon.power}, une attaque de ${extra.attack} et une défense de ${extra.defense}.`
    };
};

const renderLayout = (title, body) => `
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
        :root {
            --text: #10203a;
            --muted: #64748b;
            --card-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
            --surface: rgba(255, 255, 255, 0.90);
            --surface-strong: rgba(255, 255, 255, 0.96);
            --type-plante: #78c850;
            --type-feu: #f08030;
            --type-eau: #6890f0;
            --type-electrik: #f8d030;
            --type-psy: #f85888;
            --type-glace: #98d8d8;
            --type-roche: #b8a038;
            --type-sol: #e0c068;
            --type-vol: #a890f0;
            --type-insecte: #a8b820;
            --type-poison: #a040a0;
            --type-combat: #c03028;
            --type-fee: #ee99ac;
            --type-acier: #b8b8d0;
        }
        body {
            margin: 0;
            font-family: 'Manrope', 'Segoe UI', sans-serif;
            background:
                radial-gradient(circle at 15% 20%, rgba(250, 204, 21, 0.28) 0, rgba(250, 204, 21, 0.08) 18%, transparent 40%),
                radial-gradient(circle at 85% 10%, rgba(59, 130, 246, 0.26) 0, rgba(59, 130, 246, 0.08) 16%, transparent 36%),
                radial-gradient(circle at 80% 85%, rgba(244, 114, 182, 0.18) 0, rgba(244, 114, 182, 0.06) 20%, transparent 42%),
                linear-gradient(180deg, #f8fbff 0%, #eef4ff 48%, #e9f1ff 100%);
            color: var(--text);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }
        body::before,
        body::after {
            content: '';
            position: fixed;
            inset: auto;
            border-radius: 999px;
            pointer-events: none;
            filter: blur(8px);
            z-index: 0;
        }
        body::before {
            width: 320px;
            height: 320px;
            left: -120px;
            top: 120px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.18) 55%, transparent 72%);
            opacity: 0.6;
        }
        body::after {
            width: 420px;
            height: 420px;
            right: -150px;
            bottom: -120px;
            background: radial-gradient(circle, rgba(96, 165, 250, 0.55) 0%, rgba(96, 165, 250, 0.12) 45%, transparent 72%);
            opacity: 0.45;
        }
        .wrap {
            max-width: 1100px;
            margin: 0 auto;
            padding: 24px 20px 40px;
            position: relative;
            z-index: 1;
        }
        .hero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 24px;
            padding: 20px 24px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.72));
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(148, 163, 184, 0.16);
        }
        .hero h1, .hero p {
            margin: 0;
        }
        .hero strong {
            font-size: 28px;
            letter-spacing: -0.04em;
        }
        .home-hero {
            position: relative;
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
            padding: 28px;
            border-radius: 28px;
            background:
                linear-gradient(135deg, rgba(30, 144, 255, 0.85) 0%, rgba(59, 130, 246, 0.75) 50%, rgba(30, 61, 124, 0.80) 100%),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><radialGradient id="g1" cx="20%" cy="30%" r="40%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" /></radialGradient><radialGradient id="g2" cx="80%" cy="70%" r="50%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" /></radialGradient></defs><circle cx="200" cy="100" r="180" fill="url(%23g1)" /><circle cx="1000" cy="350" r="220" fill="url(%23g2)" /><path d="M 600 300 Q 700 250 800 300 Q 850 320 900 300" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none" /></svg>');
            background-size: cover, 400px 400px;
            background-position: center, 0 0;
            color: #fff7ed;
            box-shadow: 0 18px 44px rgba(30, 61, 124, 0.34);
            overflow: hidden;
            isolation: isolate;
        }
        .home-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.18) 0, transparent 26%),
                radial-gradient(circle at 82% 72%, rgba(255, 255, 255, 0.14) 0, transparent 20%);
            pointer-events: none;
        }
        .home-hero::after {
            content: '';
            position: absolute;
            width: 280px;
            height: 280px;
            border-radius: 999px;
            right: -70px;
            top: -70px;
            background: rgba(255, 255, 255, 0.18);
        }
        .home-title {
            margin: 0 0 12px;
            font-size: clamp(32px, 5vw, 52px);
            line-height: 1.04;
            letter-spacing: -0.04em;
        }
        .home-lead {
            margin: 0 0 18px;
            color: #ffedd5;
            font-size: 18px;
        }
        .home-cta {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            padding: 11px 16px;
            text-decoration: none;
            font-weight: 700;
            border: 1px solid transparent;
        }
        .btn.primary {
            background: rgba(15, 23, 42, 0.95);
            color: #f8fafc;
            box-shadow: 0 10px 22px rgba(15, 23, 42, 0.20);
        }
        .btn.secondary {
            color: #fff7ed;
            border-color: rgba(255, 237, 213, 0.7);
            background: rgba(124, 45, 18, 0.18);
        }
        .home-hero-right {
            z-index: 1;
            display: grid;
            align-content: end;
            gap: 10px;
        }
        .badge {
            justify-self: end;
            width: fit-content;
            border-radius: 999px;
            padding: 7px 12px;
            background: rgba(255, 247, 237, 0.22);
            border: 1px solid rgba(255, 237, 213, 0.44);
            font-size: 13px;
            font-weight: 700;
            backdrop-filter: blur(8px);
        }
        .home-panels {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 24px;
        }
        .feature {
            background: var(--surface-strong);
            border-radius: 18px;
            padding: 16px;
            box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
            border: 1px solid rgba(148, 163, 184, 0.14);
        }
        .feature h3 {
            margin: 0 0 6px;
        }
        .feature p {
            margin: 0;
            color: var(--muted);
        }
        .section-title {
            margin: 0 0 12px;
            font-size: 24px;
            letter-spacing: -0.03em;
        }
        .home-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin: 18px 0 0;
        }
        .home-stat {
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(10px);
        }
        .home-stat small {
            display: block;
            margin-bottom: 4px;
            color: rgba(255, 247, 237, 0.82);
            font-weight: 600;
        }
        .home-stat strong {
            font-size: 20px;
            letter-spacing: -0.03em;
        }
        .preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 14px;
            margin-bottom: 8px;
        }
        .card-meta {
            margin: 10px 0 0;
            text-align: center;
            color: var(--muted);
            font-size: 14px;
            font-weight: 600;
        }
        .card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
            margin-top: 10px;
        }
        .card-name-section {
            min-width: 0;
            flex: 1;
        }
        .power-badge {
            background: #dbeafe;
            color: #1e3a8a;
            border-radius: 10px;
            padding: 6px 8px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.03em;
            white-space: nowrap;
        }
        .card-types {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin: 10px 0 0;
            justify-content: center;
        }
        .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
            color: #fff;
        }
        .type-plante { background: var(--type-plante); }
        .type-feu { background: var(--type-feu); }
        .type-eau { background: var(--type-eau); }
        .type-electrik { background: var(--type-electrik); color: #3f3f46; }
        .type-psy { background: var(--type-psy); }
        .type-glace { background: var(--type-glace); color: #3f3f46; }
        .type-roche { background: var(--type-roche); }
        .type-sol { background: var(--type-sol); color: #3f3f46; }
        .type-vol { background: var(--type-vol); }
        .type-insecte { background: var(--type-insecte); }
        .type-poison { background: var(--type-poison); }
        .type-combat { background: var(--type-combat); }
        .type-fee { background: var(--type-fee); color: #3f3f46; }
        .type-acier { background: var(--type-acier); color: #3f3f46; }
        .card-substats {
            margin-top: 6px;
            font-size: 12px;
            color: #475569;
            text-align: center;
            font-weight: 700;
            letter-spacing: 0.01em;
        }
        .search-panel {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr auto auto;
            gap: 12px;
            margin-bottom: 20px;
            padding: 16px;
            border-radius: 20px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.80));
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(148, 163, 184, 0.14);
        }
        .search-panel input,
        .search-panel select,
        .search-panel button {
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 12px 14px;
            font-size: 16px;
        }
        .search-panel input,
        .search-panel select {
            width: 100%;
            background: white;
            color: var(--text);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .search-panel button {
            cursor: pointer;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            font-weight: 700;
            border: 0;
            box-shadow: 0 10px 18px rgba(37, 99, 235, 0.28);
        }
        .search-panel .secondary {
            background: #e2e8f0;
            color: #0f172a;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 18px;
        }
        .card {
            position: relative;
            text-decoration: none;
            color: inherit;
            background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98));
            border-radius: 20px;
            padding: 16px;
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            border: 1px solid rgba(148, 163, 184, 0.14);
            overflow: hidden;
        }
        .card::before {
            content: '';
            position: absolute;
            inset: 0 0 auto;
            height: 5px;
            background: linear-gradient(90deg, #f97316, #facc15, #3b82f6);
        }
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 36px rgba(15, 23, 42, 0.14);
            border-color: rgba(37, 99, 235, 0.20);
        }
        .card img, .detail img {
            width: 100%;
            height: auto;
            display: block;
        }
        .card img {
            background: #f8fafc;
            border-radius: 14px;
        }
        .name {
            margin: 12px 0 0;
            font-weight: 700;
            text-align: center;
            letter-spacing: -0.02em;
            color: var(--text);
        }
        .power-bar {
            margin-top: auto;
            height: 6px;
            border-radius: 999px;
            background: #e0e7ff;
            overflow: hidden;
            margin-bottom: 0;
        }
        .power-bar span {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 50%, #1d4ed8 100%);
        }
        .detail {
            display: grid;
            grid-template-columns: minmax(260px, 360px) 1fr;
            gap: 24px;
            align-items: center;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92));
            padding: 24px;
            border-radius: 24px;
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(148, 163, 184, 0.14);
        }
        .panel {
            display: grid;
            gap: 12px;
        }
        .detail-badge {
            width: fit-content;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(37, 99, 235, 0.10);
            color: #1d4ed8;
            font-weight: 700;
        }
        .detail-name {
            margin: 0;
            font-size: clamp(30px, 4vw, 42px);
            letter-spacing: -0.05em;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 10px;
        }
        .detail-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 4px;
        }
        .detail-tag {
            background: #dbeafe;
            color: #1e3a8a;
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 700;
        }
        .info-grid {
            margin-top: 8px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
        }
        .info-item {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            padding: 10px 12px;
        }
        .info-item small {
            display: block;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.04em;
            color: #475569;
            margin-bottom: 4px;
            font-weight: 700;
        }
        .info-item strong {
            font-size: 13px;
            color: #0f172a;
        }
        .stat {
            background: #f8fafc;
            border-radius: 14px;
            padding: 12px;
            border: 1px solid rgba(148, 163, 184, 0.12);
        }
        .stat small {
            display: block;
            color: #64748b;
            margin-bottom: 6px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            font-size: 11px;
        }
        .back {
            display: inline-block;
            margin-bottom: 18px;
            color: #2563eb;
            text-decoration: none;
            font-weight: 700;
        }
        .muted {
            color: var(--muted);
        }
        .empty {
            padding: 18px;
            background: rgba(255, 255, 255, 0.92);
            border-radius: 18px;
            box-shadow: var(--card-shadow);
            border: 1px solid rgba(148, 163, 184, 0.12);
        }
        .home-section {
            position: relative;
            margin-bottom: 32px;
        }
        .home-section::before {
            content: '';
            position: absolute;
            inset: -40px;
            pointer-events: none;
            z-index: -1;
            border-radius: 32px;
            background:
                radial-gradient(circle 280px at 12% 35%, rgba(59, 130, 246, 0.18) 0%, transparent 58%),
                radial-gradient(circle 320px at 88% 8%, rgba(30, 144, 255, 0.14) 0%, transparent 55%),
                radial-gradient(circle 360px at 75% 92%, rgba(100, 150, 255, 0.12) 0%, transparent 50%);
            filter: blur(1px);
        }
        .home-section-features {
            position: relative;
            margin-top: 40px;
            padding: 32px 0;
            border-top: 1px solid rgba(148, 163, 184, 0.08);
        }
        .home-section-features::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: -1;
            background:
                radial-gradient(circle 280px at 18% 22%, rgba(37, 99, 235, 0.14) 0%, transparent 60%),
                radial-gradient(circle 320px at 92% 75%, rgba(59, 130, 246, 0.12) 0%, transparent 58%),
                linear-gradient(135deg, rgba(219, 234, 254, 0.08) 0%, rgba(240, 249, 255, 0.05) 100%);
        }
        .home-team {
            position: relative;
        }
        .home-team::before {
            content: '';
            position: absolute;
            inset: -20px;
            pointer-events: none;
            z-index: -1;
            border-radius: 24px;
            background:
                radial-gradient(circle 260px at 22% 50%, rgba(59, 130, 246, 0.16) 0%, transparent 58%),
                radial-gradient(circle 300px at 85% 15%, rgba(30, 144, 255, 0.12) 0%, transparent 56%);
        }
        @media (max-width: 720px) {
            .hero, .detail, .home-hero {
                grid-template-columns: 1fr;
                display: grid;
            }
            .search-panel {
                grid-template-columns: 1fr;
            }
            .home-panels {
                grid-template-columns: 1fr;
            }
            .home-stats {
                grid-template-columns: 1fr;
            }
            .badge {
                justify-self: start;
            }
        }
    </style>
</head>
<body>
    <div class="wrap">
        ${body}
    </div>
</body>
</html>`;

const renderHomePage = () => {
    const averagePower = Math.round(pokemons.reduce((total, pokemon) => total + (pokemon.power || 0), 0) / pokemons.length);
    const strongestPokemon = [...pokemons].sort((left, right) => (right.power || 0) - (left.power || 0))[0];
    const highlighted = pokemons.slice(0, 4).map((pokemon) => renderCardFull(pokemon)).join('');

    return renderLayout('Accueil Pokedex', `
        <section class="home-section home-hero">
            <div>
                <h1 class="home-title">Bienvenue dans ton Pokedex</h1>
                <p class="home-lead">Une interface claire pour rechercher, choisir et consulter tous les détails de tes Pokémon.</p>
                <div class="home-cta">
                    <a class="btn primary" href="/api/pokemons">Ouvrir la recherche</a>
                    <a class="btn secondary" href="/api/pokemons?id=9">Voir Pikachu</a>
                </div>
                <div class="home-stats">
                    <div class="home-stat"><small>Pokémon</small><strong>${pokemons.length}</strong></div>
                    <div class="home-stat"><small>Puissance moyenne</small><strong>${averagePower}</strong></div>
                    <div class="home-stat"><small>Plus fort</small><strong>${escapeHtml(strongestPokemon.name)}</strong></div>
                </div>
            </div>
            <div class="home-hero-right">
                <div class="badge">${pokemons.length} pokemons disponibles</div>
                <div class="badge">Version Express</div>
                <div class="badge">Top puissance ${strongestPokemon.power}</div>
            </div>
        </section>

        <section class="home-section-features">
            <section class="home-panels">
            <article class="feature">
                <h3>Recherche rapide</h3>
                <p>Trouve un pokemon par nom en quelques lettres.</p>
            </article>
            <article class="feature">
                <h3>Sélection directe</h3>
                <p>Choisis dans la liste et affiche sa fiche complète.</p>
            </article>
            <article class="feature">
                <h3>Infos complètes</h3>
                <p>Image, HP, CP, puissance, types et date de création.</p>
            </article>
        </section>
        </section>

        <section class="home-team">
            <h2 class="section-title">Aperçu de l’équipe</h2>
            <div class="preview-grid">
                ${highlighted}
            </div>
        </section>
    `);
};

const renderSearchPanel = (query, selectedId, sortBy) => `
    <form class="search-panel" method="get" action="/api/pokemons">
        <input type="text" name="q" placeholder="Chercher un pokemon par nom" value="${escapeHtml(query)}" />
        <select name="id">
            <option value="">Choisir un pokemon</option>
            ${pokemons.map((pokemon) => `
                <option value="${pokemon.id}" ${String(selectedId) === String(pokemon.id) ? 'selected' : ''}>${escapeHtml(pokemon.name)}</option>
            `).join('')}
        </select>
        <select name="sort">
            <option value="power-desc" ${sortBy === 'power-desc' ? 'selected' : ''}>Puissance décroissante</option>
            <option value="power-asc" ${sortBy === 'power-asc' ? 'selected' : ''}>Puissance croissante</option>
            <option value="hp-desc" ${sortBy === 'hp-desc' ? 'selected' : ''}>HP décroissants</option>
            <option value="attack-desc" ${sortBy === 'attack-desc' ? 'selected' : ''}>Attaque décroissante</option>
        </select>
        <button type="submit">Voir</button>
        <a class="card secondary" href="/api/pokemons" style="display:flex;align-items:center;justify-content:center;padding:12px 14px;text-decoration:none;font-weight:700;">Réinitialiser</a>
    </form>
`;

const sortPokemons = (items, sortBy) => {
    const list = [...items];

    if (sortBy === 'power-asc') {
        return list.sort((left, right) => (left.power || 0) - (right.power || 0));
    }

    if (sortBy === 'hp-desc') {
        return list.sort((left, right) => (right.hp || 0) - (left.hp || 0));
    }

    if (sortBy === 'attack-desc') {
        return list.sort((left, right) => getPokemonExtraStats(right).attack - getPokemonExtraStats(left).attack);
    }

    return list.sort((left, right) => (right.power || 0) - (left.power || 0));
};

const getPowerStars = (power) => {
    const stars = Math.min(5, Math.max(1, Math.ceil((power || 0) / 9)));
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

const getTypeClass = (type) => {
    return 'type-' + (type || 'normal').toLowerCase().replace(/[éè]/g, 'e');
};

const renderTypesBadges = (types) => {
    return types.map(type => `<span class="type-badge ${getTypeClass(type)}">${escapeHtml(type)}</span>`).join('');
};

const renderCardFull = (pokemon) => {
    const extra = getPokemonExtraStats(pokemon);

    return `
    <a class="card" href="/api/pokemons?id=${pokemon.id}">
        <img src="${pokemon.picture}" alt="${escapeHtml(pokemon.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';" />
        <div class="card-header">
            <div class="card-name-section">
                <p class="name">${escapeHtml(pokemon.name)}</p>
                <p class="card-meta">n°${pokemon.id} • ${extra.rarity}</p>
            </div>
            <div class="power-badge">PWR ${pokemon.power}</div>
        </div>
        <div class="card-types">${renderTypesBadges(pokemon.types)}</div>
        <p class="card-substats">ATK ${extra.attack} • DEF ${extra.defense} • VIT ${extra.speed}</p>
        <div class="power-bar"><span style="width:${Math.min(100, Math.max(20, pokemon.power * 2.2))}%;"></span></div>
    </a>
`;
};

const renderGallery = (items, query = '', selectedId = '', sortBy = 'power-desc') => {
    const cards = items.map((pokemon) => renderCardFull(pokemon)).join('');

    return renderLayout('Pokemons', `
        <section class="hero">
            <div>
                <h1>Pokemons en images</h1>
                <p class="muted">Recherche un nom ou choisis un pokemon dans la liste.</p>
            </div>
            <div>
                <strong>${items.length}</strong>
                <div class="muted">Pokemons</div>
            </div>
        </section>
        ${renderSearchPanel(query, selectedId, sortBy)}
        <main class="grid">
            ${cards.length ? cards : '<div class="empty">Aucun pokemon trouvé.</div>'}
        </main>
    `);
};

const renderPokemonDetailBlock = (pokemon) => {
    if (!pokemon) {
        return `
            <section class="detail">
                <div class="panel">
                    <h1>Pokemon introuvable</h1>
                    <p class="muted">Aucune image n’est disponible pour cet identifiant.</p>
                </div>
            </section>
        `;
    }

    const extra = getPokemonExtraStats(pokemon);
    const full = getPokemonFullInfo(pokemon);

    return `
        <section class="detail">
            <img src="${pokemon.picture}" alt="${escapeHtml(pokemon.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';" />
            <div class="panel">
                <div class="detail-badge">Pokémon n°${pokemon.id}</div>
                <h1 class="detail-name">${escapeHtml(pokemon.name)}</h1>
                <p class="muted">Pokemon n°${pokemon.id}</p>
                <div class="detail-tags">
                    <span class="detail-tag">Rareté: ${extra.rarity}</span>
                    <span class="detail-tag">Étoiles: ${getPowerStars(pokemon.power)}</span>
                </div>
                <div class="stats">
                    <div class="stat"><small>HP</small><strong>${pokemon.hp}</strong></div>
                    <div class="stat"><small>CP</small><strong>${pokemon.cp}</strong></div>
                    <div class="stat"><small>Puissance</small><strong>${pokemon.power}</strong></div>
                    <div class="stat"><small>Attaque</small><strong>${extra.attack}</strong></div>
                    <div class="stat"><small>Défense</small><strong>${extra.defense}</strong></div>
                    <div class="stat"><small>Vitesse</small><strong>${extra.speed}</strong></div>
                    <div class="stat"><small>Types</small><strong>${pokemon.types.join(' / ')}</strong></div>
                    <div class="stat"><small>Créé le</small><strong>${formatDate(pokemon.created)}</strong></div>
                </div>
                <div class="info-grid">
                    <div class="info-item"><small>Catégorie</small><strong>${escapeHtml(full.categorie)}</strong></div>
                    <div class="info-item"><small>Taille</small><strong>${full.taille}</strong></div>
                    <div class="info-item"><small>Poids</small><strong>${full.poids}</strong></div>
                    <div class="info-item"><small>Génération</small><strong>${full.generation}</strong></div>
                    <div class="info-item"><small>Région</small><strong>${full.region}</strong></div>
                    <div class="info-item"><small>Capture</small><strong>${full.capture}</strong></div>
                    <div class="info-item"><small>Talents</small><strong>${full.talents.join(' / ')}</strong></div>
                    <div class="info-item"><small>Faiblesses</small><strong>${full.faiblesses.join(' / ')}</strong></div>
                    <div class="info-item"><small>Résistances</small><strong>${full.resistances.join(' / ')}</strong></div>
                    <div class="info-item"><small>Évolution</small><strong>${escapeHtml(full.evolution)}</strong></div>
                </div>
                <p class="muted">${escapeHtml(full.description)}</p>
                <div class="power-bar"><span style="width:${Math.min(100, Math.max(20, pokemon.power * 2.2))}%;"></span></div>
            </div>
        </section>
    `;
};
/*
*---------------
* R O U T I N G
*---------------
*/
// GET
app.get('/', (req, res) => {
    res.send(renderHomePage());
});
/*
app.get('/api/pokemons/1', (req, res) => {
    res.send(`<h3>Bulbizarre !</h3>`);
});
*/
// parameter
/*
app.get('/api/pokemons/:id', (req, res) => {
    const id = req.params.id;
    res.send(`<h3>About Pokemon ${id} !</h3>`);
});
// parameters
app.get('/api/pokemons/:id/:name', (req, res) => {
    //
    const id = req.params.id;
    const name = req.params.name;
    //
    res.send(`<h3>About Pokemon ${id} : ${name} !</h3>`);
});
*/
app.get('/api/pokemons', (req, res) => {
    const query = String(req.query.q || '').trim();
    const sortBy = String(req.query.sort || 'power-desc');
    const selectedId = parseInt(req.query.id, 10);
    const filteredPokemons = query
        ? pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(query.toLowerCase()))
        : pokemons;
    const visiblePokemons = sortPokemons(filteredPokemons, sortBy);
    const selectedPokemon = Number.isInteger(selectedId)
        ? pokemons.find((pokemon) => pokemon.id === selectedId)
        : null;

    if (selectedPokemon) {
        return res.send(renderLayout('Pokemon sélectionné', `
            <a class="back" href="/api/pokemons">← Retour à la recherche</a>
            ${renderSearchPanel(query, selectedId, sortBy)}
            ${renderPokemonDetailBlock(selectedPokemon)}
        `));
    }

    res.send(renderGallery(visiblePokemons, query, '', sortBy));
});
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // search for the id & give the name if exist...
    const pokemon = pokemons.find( pokemon=> pokemon.id === id );
    res.send(renderLayout('Pokemon sélectionné', `
        <a class="back" href="/api/pokemons">← Retour à la recherche</a>
        ${renderSearchPanel('', pokemon ? pokemon.id : '', 'power-desc')}
        ${renderPokemonDetailBlock(pokemon)}
    `));
});


/*
*-----------------------------------------------
* L O G  O N  A D M I N  S C R E E N
*-----------------------------------------------
*/
app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});



