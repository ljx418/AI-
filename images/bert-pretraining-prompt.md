# Prompt: BERT Pretraining Diagram

## Image Style
Academic paper method pipeline overview diagram, white background, clean vector style.

## Subject
BERT pretraining process showing MLM (Masked Language Model) and NSP (Next Sentence Prediction) tasks with pretraining + fine-tuning flow.

## Prompt

```
A clean method pipeline overview diagram in the style of a NeurIPS/ICLR paper figure, white background.

Show BERT pretraining process in three major phases:

TOP SECTION - PRETRAINING PHASE (labeled "Pretraining"):

Left side - Input:
- Two sentences: "The cat sat on the mat" and "It was very comfortable"
- Label: "Sentence A: The cat sat on the mat"
- Label: "Sentence B: It was very comfortable"
- Add [CLS] token at start and [SEP] token between/after sentences
- Show tokenization as small vertical bars

Center - MLM (Masked Language Model) task:
- Zoomed annotation showing masked tokens:
  - "The cat sat on the [MASK] → mat" (masked word replaced)
  - Highlight masked tokens in red
- Arrow pointing to "MLM Head" box
- Label: "Masked Language Model"
- Show output predictions: "mask → {mat, floor, chair...}"

Center - NSP (Next Sentence Prediction) task:
- Arrow from [CLS] token to "NSP Head" box
- Label: "Next Sentence Prediction"
- Show binary classification: "Is Next Sentence? [Yes] / [No]"

Right side - Output:
- Show loss function: "Loss = L_MLM + L_NSP"
- Arrow pointing down to Pretrained BERT weights

MIDDLE SECTION - FINE-TUNING PHASE (labeled "Fine-tuning"):
- Show horizontal flow
- Input: Task-specific data (labeled "Task Data")
- Pass through same BERT architecture (labeled "BERT")
- Task-specific output heads:
  - For QA: Question Answering Head
  - For Classification: Classification Head
- Show label: "Task-specific fine-tuning"

BOTTOM - DOWNSTREAM TASKS (labeled "Downstream Tasks"):
- Show 4 example task icons in a row:
  1. Text Classification (document icon with checkmark)
  2. Question Answering (question mark icon)
  3. Named Entity Recognition (tag/location icon)
  4. Natural Language Inference (comparison icon)

CONNECTIONS:
- Arrows connect all stages left to right
- Use solid thin black arrows
- Phase labels in bold above each section

COLOR PALETTE:
- BERT Core: light indigo fill (#E0E7FF), indigo border (#6366F1)
- MLM Head: light red fill (#FEE2E2), red border (#DC2626)
- NSP Head: light amber fill (#FEF3C7), amber border (#D97706)
- Task Heads: light emerald fill (#D1FAE5), emerald border (#059669)
- Background: white #FFFFFF
- Text: dark slate #1E293B

STYLE:
- Stage blocks: rounded rectangles, uniform size
- All text in Helvetica/sans-serif, 10-12pt
- Bold phase labels above each section
- Subtle connecting arrows
- No 3D effects, no shadows, no gradients
- Clean vector style
- Aspect ratio: 16:9
```

## Output File
Save as: /Users/Zhuanz/Desktop/workspace/1-AI教案/images/bert-pretraining.svg