#!/usr/bin/env python3
"""
MD to Jupyter Notebook Converter
Converts AI textbook MD files (L1-L24) into Jupyter Notebook format (.ipynb)
Pure implementation without external dependencies
"""

import os
import re
import json
from pathlib import Path


def create_notebook_json(cells, kernel="python3"):
    """Create a Jupyter notebook JSON structure"""
    return {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": kernel
            },
            "language_info": {
                "name": "python",
                "version": "3.11.0"
            }
        },
        "cells": cells
    }


def create_markdown_cell(content, cell_id):
    """Create a markdown cell"""
    return {
        "cell_type": "markdown",
        "metadata": {"id": f"cell-{cell_id}"},
        "source": content if content.endswith('\n') else content + '\n'
    }


def create_code_cell(content, cell_id):
    """Create a code cell"""
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {"id": f"cell-{cell_id}"},
        "outputs": [],
        "source": content if content.endswith('\n') else content + '\n'
    }


def split_into_cells(content):
    """Split markdown content into cells based on code blocks"""
    cells = []
    lines = content.split('\n')
    current_markdown = []
    in_code_block = False
    code_lines = []

    for line in lines:
        stripped = line.strip()
        # Check for code block start/end
        if stripped.startswith('```') and not in_code_block:
            # Save current markdown if non-empty
            if current_markdown:
                md_text = '\n'.join(current_markdown).strip()
                if md_text:
                    cells.append(('markdown', md_text))
                current_markdown = []
            # Start code block (capture language if present)
            in_code_block = True
            # Skip the ```language line itself
            code_lines = []
        elif stripped == '```' and in_code_block:
            # End code block
            in_code_block = False
            code_text = '\n'.join(code_lines)
            if code_text.strip():
                cells.append(('code', code_text))
        elif in_code_block:
            code_lines.append(line)
        else:
            current_markdown.append(line)

    # Don't forget remaining markdown
    if current_markdown:
        md_text = '\n'.join(current_markdown).strip()
        if md_text:
            cells.append(('markdown', md_text))

    return cells


def extract_lessons(content):
    """Extract individual lessons from combined content"""
    # Pattern to match lesson headers like # L1:, # L2:, # L1： etc.
    # Handles both English colon (:) and Chinese colon (：)
    # Captures: (header line)(content until next lesson or end)
    lesson_pattern = r'(# L(\d+)[:：][^\n]*\n)(.*?)(?=(?=# L\d+[:：])|$)'

    matches = list(re.finditer(lesson_pattern, content, re.DOTALL | re.MULTILINE))

    lessons = []
    for i, match in enumerate(matches):
        lesson_num = match.group(2)
        lesson_header = match.group(1).strip()

        # Get full content for this lesson
        start_pos = match.start()
        end_pos = matches[i+1].start() if i+1 < len(matches) else len(content)
        full_content = content[start_pos:end_pos]

        lessons.append({
            'num': lesson_num,
            'header': lesson_header,
            'content': full_content
        })

    return lessons


def create_notebook(lesson_content, lesson_num, lesson_title):
    """Create a Jupyter notebook from lesson content"""
    cells = []

    # Add title as first markdown cell
    title_content = f"# {lesson_title}\n"
    cells.append(create_markdown_cell(title_content, 0))

    # Split content into cells
    cell_id = 1
    raw_cells = split_into_cells(lesson_content)

    for cell_type, cell_content in raw_cells:
        if cell_type == 'markdown':
            cells.append(create_markdown_cell(cell_content, cell_id))
        else:
            cells.append(create_code_cell(cell_content, cell_id))
        cell_id += 1

    return create_notebook_json(cells)


def convert_md_to_ipynb(md_file_path, output_dir):
    """Convert a MD file containing multiple lessons to individual .ipynb files"""
    print(f"Processing: {md_file_path}")

    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract lessons
    lessons = extract_lessons(content)
    print(f"  Found {len(lessons)} lessons: {', '.join([l['num'] for l in lessons])}")

    # Create output directory
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    converted = []
    for lesson in lessons:
        lesson_num = lesson['num']
        lesson_title = lesson['header'].replace('# ', '').strip()

        nb = create_notebook(lesson['content'], lesson_num, lesson_title)

        output_file = output_dir / f"L{lesson_num}.ipynb"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(nb, f, indent=1, ensure_ascii=False)

        converted.append(f"L{lesson_num}.ipynb")
        print(f"  Created: {output_file.name}")

    return converted


def main():
    """Main entry point"""
    base_dir = Path(__file__).parent
    md_files = [
        base_dir / "AI教材_L1-L4_详细教学内容.md",
        base_dir / "AI教材_L5-L8_详细教学内容.md",
        base_dir / "AI教材_L9-L12_详细教学内容.md",
        base_dir / "AI教材_L13-L16_详细教学内容.md",
        base_dir / "AI教材_L17-L20_详细教学内容.md",
        base_dir / "AI教材_L21-L24_详细教学内容.md",
    ]

    output_dir = base_dir / "notebooks"

    print("=" * 60)
    print("MD to Jupyter Notebook Converter")
    print("=" * 60)

    total_converted = []
    for md_file in md_files:
        if md_file.exists():
            converted = convert_md_to_ipynb(md_file, output_dir)
            total_converted.extend(converted)
        else:
            print(f"Warning: File not found: {md_file}")

    print("=" * 60)
    print(f"Conversion complete! Generated {len(total_converted)} notebooks:")
    for nb in sorted(total_converted):
        print(f"  - {nb}")
    print(f"Output directory: {output_dir}")


if __name__ == "__main__":
    main()