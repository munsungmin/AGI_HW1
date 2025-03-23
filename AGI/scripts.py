import os
import random
import numpy as np

# 설정값
gene_txt_path = r"/home/f1_u1/sungmin/courses/AGI/genes.txt"
template_path = r"/home/f1_u1/sungmin/courses/AGI/base_template.js"
output_dir = os.path.dirname(gene_txt_path)
num_new_genes = 20
mutation_std = 0.5
big_mutation_std = 0.8
big_mutation_prob = 0.3

# 중괄호 이스케이프 함수 (format 안전하게 사용하기 위해)
def escape_curly_braces(js_code):
    return js_code.replace("{", "{{").replace("}", "}}")

# gene.txt 읽기
with open(gene_txt_path, 'r') as f:
    lines = f.readlines()

genes = []
for line in lines:
    parts = list(map(float, line.strip().split(',')))
    if len(parts) >= 7:
        genes.append((parts[:6], parts[6]))  # (genes, winrate)

# 승률 내림차순 정렬 후 상위 절반 선택
genes.sort(key=lambda x: x[1], reverse=True)
top_genes = [g[0] for g in genes[:max(2, len(genes)//2)]]

# mutation 함수 (일정 확률로 큰 변이)
def mutate_gene(parent1, parent2, std=0.05, big_std=0.3, big_prob=0.1):
    child = [random.choice([g1, g2]) for g1, g2 in zip(parent1, parent2)]
    mutated = []
    for g in child:
        if random.random() < big_prob:
            noise = np.random.normal(0, big_std)
        else:
            noise = np.random.normal(0, std)
        new_val = min(1.0, max(0.0, g + noise))
        if new_val == 0.0 or 1.0:
            new_val = np.random.uniform(0,1)
        mutated.append(new_val)
    return mutated

# 템플릿 로딩 및 이스케이프
with open(template_path, "r", encoding="utf-8") as f:
    raw_template = f.read()
escaped_template = escape_curly_braces(raw_template)

# gene 포맷 부분만 다시 {}로 복구 (단 6개 상수만)
for i in range(6):
    escaped_template = escaped_template.replace("{{" + str(i) + "}}", "{" + str(i) + "}")

# JS 파일 생성
for _ in range(num_new_genes):
    p1, p2 = random.sample(top_genes, 2)
    new_gene = mutate_gene(p1, p2, mutation_std, big_mutation_std, big_mutation_prob)
    formatted_values = [f"{v:.4f}" for v in new_gene]
    js_code = escaped_template.format(*formatted_values)
    filename = ",".join(formatted_values) + ".js"
    filepath = os.path.join(output_dir, filename)
    with open(filepath, 'w', encoding="utf-8") as f:
        f.write(js_code)

print(f"✅ JS 파일 {num_new_genes}개 생성 완료! 경로: {output_dir}")
