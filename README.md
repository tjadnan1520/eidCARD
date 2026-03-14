# eidCARD

A simple web app to create and download personalized Eid greeting cards.

## Features

- Personalized sender and receiver names
- Optional custom message with automatic fallback text
- English and Bangla language support
- Multiple card designs: Classic Frame, Letter Style, Long Page
- PNG download using `html2canvas`


## How to Use

1. Click **Create Your Card**.
2. Fill in **To**, **From**, choose design and language.
3. Add a custom message (optional).
4. Click **Generate Card**.
5. Click **Download Card** to save the card as a PNG image.

## Notes

- If the message is empty, a default Eid blessing is used.
- Message character limits change based on selected card design.