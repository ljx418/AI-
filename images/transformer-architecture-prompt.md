# Prompt: Transformer Architecture Diagram

## Image Style
Academic paper neural network architecture diagram, white background, clean vector style.

## Subject
Complete Transformer architecture showing Encoder-Decoder structure with Multi-head Self-Attention annotations.

## Prompt

```
A clean neural network architecture diagram in the style of a CVPR/NeurIPS paper figure, white background.

Show a complete Transformer architecture flowing left to right:

LEFT SIDE - INPUT:
- Input sentence tokenized into word tokens represented as small vertical bars
- Label: "Input Tokens: x₁, x₂, ..., xₙ"

CENTER LEFT - ENCODER STACK (labeled "Encoder"):
- 6 identical encoder layers stacked vertically
- Each encoder layer contains two sublayers:
  1. Multi-Head Self-Attention (labeled "Multi-Head Self-Attention (×8 heads)")
  2. Feed-Forward Network (labeled "FFN")
- Show residual connections as curved arrows with "+" symbol
- Label each layer with tensor shape: "H×d_model" where d_model=512

CENTER - CROSS-ATTENTION CONNECTION:
- Dotted arrow from top of encoder flowing into decoder cross-attention layer
- Label: "K, V (Keys & Values)"

CENTER RIGHT - DECODER STACK (labeled "Decoder"):
- 6 identical decoder layers stacked vertically
- Each decoder layer contains three sublayers:
  1. Masked Multi-Head Self-Attention (labeled "Masked Self-Attention")
  2. Cross-Attention (labeled "Multi-Head Cross-Attention")
  3. Feed-Forward Network (labeled "FFN")
- Show residual connections
- Label each layer with same tensor shape

RIGHT SIDE - OUTPUT:
- Output probability distribution over vocabulary
- Label: "Output Probabilities"

ANNOTATIONS:
- Use thin black leader lines to label key components
- Show zoomed-in "Multi-Head Attention" detail box in top-right corner:
  - Display 8 parallel attention heads as colored lines connecting query to key/value
  - Label: "h = 8 heads, d_k = 64"

COLOR PALETTE (muted academic colors):
- Self-Attention blocks: light red fill (#FEE2E2), red border (#DC2626)
- Cross-Attention blocks: light amber fill (#FEF3C7), amber border (#D97706)
- FFN blocks: light emerald fill (#D1FAE5), emerald border (#059669)
- Embedding blocks: light indigo fill (#E0E7FF), indigo border (#6366F1)
- Norm/Residual: light gray fill (#F3F4F6), gray border (#6B7280)

STYLE:
- All text in Helvetica/sans-serif, 10-12pt
- Tensor shapes in monospace font
- Arrows: thin black solid lines with triangle arrowheads
- Residual arrows: dashed curved lines
- Grid background: very subtle light gray grid lines
- No 3D effects, no shadows, no gradients
- Crisp vector-clean lines
- Aspect ratio: 16:9
```

## Output File
Save as: /Users/Zhuanz/Desktop/workspace/1-AI教案/images/transformer-architecture.svg