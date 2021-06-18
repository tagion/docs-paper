
EMPTY:=
SPACE:=${EMPTY} ${EMPTY}
BACKSLASH:=${EMPTY}\\${EMPTY}
LATEXBACKSLASH:=${BACKSLASH}${BACKSLASH}

MAIN:=tagion_tech_paper

TMPEXT=log lot pdf toc aux lof nlo nls ilg

TMPMAIN:=${addprefix ${MAIN}., ${TMPEXT}}

GITVERSION:=perl scripts/gitversion.pl
GITREV:=gitversion.tex

include version.mk

.PHONY: ${GITREV}

all: ${GITREV} nomenclature bibliotek dex_example

%.nlo: %.tex

nomenclature: ${MAIN}.nls

bibliotek:
	biber ${MAIN}

dex_example:
	$(MAKE) -C dex

%.nls: %.nlo
	makeindex $< -s nomencl.ist -o $@

${GITREV}:
	${GITVERSION} ${VERSION} >$@

clean:
	rm -f ${TMPMAIN}
	$(MAKE) -C dex clean
