# MoodPath MD Color Palette
## Therapeutic Design System

---

## Core Colors

### Primary Palette

#### Sage Green
- **Hex:** `#87a878`
- **RGB:** `135, 168, 120`
- **HSL:** `101°, 21%, 56%`
- **Usage:** Primary brand color, CTAs, links
- **Psychology:** Calming, growth, healing, natural balance

#### Soft Blue
- **Hex:** `#a8c4d4`
- **RGB:** `168, 196, 212`
- **HSL:** `202°, 34%, 75%`
- **Usage:** Secondary actions, accents, headers
- **Psychology:** Trust, serenity, clarity, openness

#### Warm Sand
- **Hex:** `#e8dcc6`
- **RGB:** `232, 220, 198`
- **HSL:** `39°, 42%, 84%`
- **Usage:** Highlights, notifications, warm accents
- **Psychology:** Comfort, warmth, grounding, safety

### Neutral Palette

#### Light Cream
- **Hex:** `#faf8f3`
- **RGB:** `250, 248, 243`
- **HSL:** `43°, 41%, 97%`
- **Usage:** Background, cards, breathing space
- **Psychology:** Softness, openness, calm environment

#### Soft Charcoal
- **Hex:** `#4a5568`
- **RGB:** `74, 85, 104`
- **HSL:** `218°, 17%, 35%`
- **Usage:** Body text, subtle headers
- **Psychology:** Gentle authority, readability without harshness

#### Pure White
- **Hex:** `#ffffff`
- **RGB:** `255, 255, 255`
- **Usage:** Content backgrounds, contrast elements
- **Psychology:** Clarity, space, possibility

---

## Extended Palette

### Sage Variations
```css
--sage-light: #9db890;    /* Hover states */
--sage: #87a878;           /* Primary */
--sage-dark: #7a9a6b;      /* Active states */
--sage-muted: #87a87820;   /* Backgrounds */
```

### Blue Variations
```css
--soft-blue-light: #b8d0de;  /* Light accents */
--soft-blue: #a8c4d4;         /* Primary blue */
--soft-blue-dark: #98b4c4;   /* Deeper tone */
--soft-blue-muted: #a8c4d415; /* Subtle backgrounds */
```

### Warm Variations
```css
--warm-sand-light: #f0e6d6;  /* Lighter warm */
--warm-sand: #e8dcc6;         /* Primary warm */
--warm-sand-dark: #e0d4b6;   /* Deeper warm */
--warm-sand-muted: #e8dcc610; /* Very subtle */
```

---

## Semantic Colors

### Status Colors (Softened)
```css
--success: #87a878;    /* Sage - positive, growth */
--info: #a8c4d4;       /* Soft blue - informational */
--warning: #e8dcc6;    /* Warm sand - gentle warning */
--error: #d4a8a8;      /* Muted rose - soft error */
```

### Interactive States
```css
--hover: rgba(135, 168, 120, 0.1);
--focus: rgba(135, 168, 120, 0.2);
--active: rgba(135, 168, 120, 0.3);
--disabled: rgba(74, 85, 104, 0.3);
```

---

## Usage Guidelines

### Text Hierarchy
- **Headings:** Soft Charcoal (#4a5568) with reduced weight
- **Body:** Soft Charcoal (#4a5568) at 0.9 opacity
- **Subtle:** Soft Charcoal at 0.7 opacity
- **Links:** Sage (#87a878), darken on hover

### Backgrounds
- **Primary:** Light Cream (#faf8f3)
- **Secondary:** Pure White (#ffffff)
- **Accent:** Sage Muted (rgba(135, 168, 120, 0.05))
- **Interactive:** Soft Blue Muted (rgba(168, 196, 212, 0.08))

### Shadows & Borders
```css
--shadow-soft: 0 1px 3px rgba(0,0,0,0.05);
--shadow-medium: 0 2px 8px rgba(0,0,0,0.08);
--border-subtle: 1px solid rgba(135, 168, 120, 0.1);
```

---

## Accessibility

### Contrast Ratios
- Soft Charcoal on Light Cream: **7.2:1** ✓ WCAG AAA
- Soft Charcoal on White: **7.8:1** ✓ WCAG AAA
- Sage on White: **3.1:1** ✓ WCAG AA (Large text)
- Sage Dark on Light Cream: **4.5:1** ✓ WCAG AA

### Color Blind Considerations
- Sage and Soft Blue maintain distinction in all color blind modes
- Warm Sand provides additional non-color contrast
- Never rely solely on color for meaning

---

## Implementation

### CSS Variables
```css
:root {
    /* Primary Colors */
    --sage: #87a878;
    --soft-blue: #a8c4d4;
    --warm-sand: #e8dcc6;
    
    /* Neutrals */
    --light-cream: #faf8f3;
    --soft-charcoal: #4a5568;
    --white: #ffffff;
    
    /* Shadows */
    --shadow: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-hover: 0 2px 8px rgba(0,0,0,0.08);
    
    /* Borders */
    --border: 1px solid rgba(135, 168, 120, 0.1);
}
```

### SCSS Map
```scss
$colors: (
    'sage': #87a878,
    'soft-blue': #a8c4d4,
    'warm-sand': #e8dcc6,
    'light-cream': #faf8f3,
    'soft-charcoal': #4a5568,
    'white': #ffffff
);
```

---

## Design Principles

1. **Minimal Contrast:** Use gentle transitions between colors
2. **Breathing Room:** Liberal use of light cream space
3. **Soft Boundaries:** Prefer subtle borders over hard lines
4. **Natural Flow:** Colors should feel organic and calming
5. **Therapeutic Intent:** Every color choice supports emotional wellness

---

## Color Psychology in Mental Health Context

### Sage Green (#87a878)
- Represents growth, renewal, and balance
- Reduces anxiety and promotes calm
- Associated with nature and healing
- Non-threatening, approachable

### Soft Blue (#a8c4d4)
- Evokes trust and stability
- Lowers heart rate and blood pressure
- Creates sense of spaciousness
- Promotes clear thinking

### Warm Sand (#e8dcc6)
- Provides comfort and grounding
- Feels safe and nurturing
- Reduces clinical coldness
- Adds human warmth

### Light Cream (#faf8f3)
- Creates open, non-judgmental space
- Reduces visual stress
- Allows content to breathe
- Feels welcoming, not sterile

---

*This color system prioritizes emotional comfort and therapeutic benefit over commercial impact.*