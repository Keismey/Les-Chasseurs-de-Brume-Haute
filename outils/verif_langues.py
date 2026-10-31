#!/usr/bin/env python3
"""Compare la logique de game.fr.js et game.en.js, textes mis de côté.

Les deux fichiers du jeu sont identiques à part les textes. Ce script retire
les chaînes ('…', "…", parties texte des `…`), les commentaires et les regex,
puis compare ce qui reste (le code). Toute différence est signalée avec ses
numéros de ligne (une ligne de code acceptée ne couvre que cette ligne-là) : soit une correction faite dans une seule langue, soit une
différence voulue (pluriel, ordre des mots…) à ajouter dans
outils/verif_langues_ok.txt.

Usage : python3 outils/verif_langues.py        (depuis la racine du dépôt)
Sortie : code 0 si tout correspond, 1 sinon. Aucune dépendance.
"""
import difflib, os, sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OK = os.path.join(RACINE, 'outils', 'verif_langues_ok.txt')
AVANT_REGEX = set('(,=:[!&|?{};+-*%<>~^') | {''}
MOTS_AVANT_REGEX = {'return', 'typeof', 'case', 'in', 'of', 'delete', 'void', 'throw', 'new', 'else', 'do'}


def jetons(src):
    """Découpe le JS en (ligne, jeton) ; chaque chaîne ou texte de gabarit devient 'S'."""
    out, i, n, ligne = [], 0, len(src), 1
    pile = []  # profondeur d'accolades de chaque ${ … } ouvert dans un gabarit

    def dernier():
        return out[-1][1] if out else ''

    def ajoute(t):
        out.append((ligne, t))

    def gabarit(i):
        """Lit le texte d'un gabarit depuis i jusqu'à ` ou ${ ; renvoie (i, fin_gabarit)."""
        nonlocal ligne
        while i < n:
            c = src[i]
            if c == '\\':
                i += 2; continue
            if c == '\n':
                ligne += 1
            if c == '`':
                return i + 1, True
            if c == '$' and i + 1 < n and src[i + 1] == '{':
                return i + 2, False
            i += 1
        return i, True

    while i < n:
        c = src[i]
        if c == '\n':
            ligne += 1; i += 1; continue
        if c in ' \t\r':
            i += 1; continue
        if src.startswith('//', i):
            j = src.find('\n', i); i = n if j < 0 else j; continue
        if src.startswith('/*', i):
            j = src.find('*/', i + 2); j = n if j < 0 else j + 2
            ligne += src.count('\n', i, j); i = j; continue
        if c in '\'"':
            j = i + 1
            while j < n and src[j] != c and src[j] != '\n':
                j += 2 if src[j] == '\\' else 1
            ajoute('S'); ligne += src.count('\n', i, min(j, n)); i = j + 1; continue
        if c == '`':
            i, fin = gabarit(i + 1)
            ajoute('S')
            if not fin:
                ajoute('${'); pile.append(0)
            continue
        if c == '}' and pile and pile[-1] == 0:
            pile.pop(); ajoute('}$')
            i, fin = gabarit(i + 1)
            ajoute('S')
            if not fin:
                ajoute('${'); pile.append(0)
            continue
        if c == '{' and pile:
            pile[-1] += 1
        if c == '}' and pile:
            pile[-1] -= 1
        if c == '/' and (dernier() in AVANT_REGEX or dernier() in MOTS_AVANT_REGEX):
            j, classe = i + 1, False
            while j < n and (src[j] != '/' or classe):
                if src[j] == '\\':
                    j += 1
                elif src[j] == '[':
                    classe = True
                elif src[j] == ']':
                    classe = False
                j += 1
            j += 1
            while j < n and src[j].isalpha():
                j += 1
            ajoute('R'); i = j; continue
        if c.isalnum() or c in '_$':
            j = i
            while j < n and (src[j].isalnum() or src[j] in '_$'):
                j += 1
            ajoute(src[i:j]); i = j; continue
        ajoute(c); i += 1
    return out


def fusionne_textes(js):
    """« S + S » ou « S S » (texte coupé autrement selon la langue) compte comme un seul texte."""
    out = []
    for l, t in js:
        if t == 'S' and out and out[-1][1] == 'S':
            continue
        if t == 'S' and len(out) >= 2 and out[-1][1] == '+' and out[-2][1] == 'S':
            out.pop(); continue
        out.append((l, t))
    return out


def par_ligne(js):
    """Regroupe les jetons par ligne d'origine : une ligne de code = une chaîne à comparer."""
    lignes = {}
    for l, t in js:
        lignes.setdefault(l, []).append(t)
    return [(l, ' '.join(ts)) for l, ts in sorted(lignes.items())]


def main():
    a = par_ligne(fusionne_textes(jetons(open(os.path.join(RACINE, 'game.fr.js'), encoding='utf-8').read())))
    b = par_ligne(fusionne_textes(jetons(open(os.path.join(RACINE, 'game.en.js'), encoding='utf-8').read())))
    ok = set()
    if os.path.exists(OK):
        for l in open(OK, encoding='utf-8'):
            l = l.strip()
            if l and not l.startswith('#'):
                ok.add(l)
    sm = difflib.SequenceMatcher(None, [t for _, t in a], [t for _, t in b], autojunk=False)
    ecarts = 0
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            continue
        for k in range(max(i2 - i1, j2 - j1)):
            fa = a[i1 + k] if i1 + k < i2 else None
            fb = b[j1 + k] if j1 + k < j2 else None
            if fa and fb:
                m = difflib.SequenceMatcher(None, fa[1].split(' '), fb[1].split(' '), autojunk=False)
                bouts = [(' '.join(fa[1].split(' ')[x1:x2]), ' '.join(fb[1].split(' ')[y1:y2]))
                         for o, x1, x2, y1, y2 in m.get_opcodes() if o != 'equal']
            else:
                bouts = [(fa[1] if fa else '', fb[1] if fb else '')]
            cle = f'{fa[1] if fa else ""} || {fb[1] if fb else ""}'.strip()
            if cle in ok:
                continue
            for fr, en in bouts:
                ecarts += 1
                print(f'Écart {ecarts} : game.fr.js ligne {fa[0] if fa else "-"}, game.en.js ligne {fb[0] if fb else "-"}')
                print(f'  fr : {fr[:200] or "(rien)"}')
                print(f'  en : {en[:200] or "(rien)"}')
            if bouts:
                print('  si voulu, ajouter cette ligne dans outils/verif_langues_ok.txt :')
                print('  ' + cle)
    if ecarts:
        print(f'\n{ecarts} écart(s) de code entre le français et l’anglais.')
        return 1
    print('OK : game.fr.js et game.en.js ont le même code (textes mis à part).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
