
TEXFILES+=toq_table.tex
TEXFILES+=ask_sales_table_rest.tex
TEXFILES+=toq_table_rest.tex
TEXFILES+=bid_sales_table_executed.tex
TEXFILES+=ask_sales_table_executed.tex
TEXFILES+=ask_sales_table.tex
TEXFILES+=bid_sales_table_rest.tex
TEXFILES+=bid_sales_table.tex
TEXFILES+=toq_table_executed.tex
TEXFILES+=matching_pairs.tex

NODE_MODULES:=node_modules

all: ${NODE_MODULES} ${TEXFILES}

${TEXFILES}:
	node dex.js

${NODE_MODULES}:
	npm install


clean:
	rm -fR ${NODE_MODULES}
	rm -f ${TEXFILES}
