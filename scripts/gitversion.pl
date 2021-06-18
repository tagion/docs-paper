#!/usr/bin/perl
my $REMOTE=`git config --get remote.origin.url`;
my $HASH=`git rev-parse HEAD`;
my $REVNO=` git log --pretty=format:'%h' | wc -l`;
my $BRANCH=`git rev-parse --abbrev-ref HEAD`;
$REVNO =~ s/^\s+|\s+$//g;
printf("\\newcommand{\\gitversion}{\n");
printf("$REMOTE");
printf("\\newline\n");
printf("$HASH");
printf("\\newline\n");
printf("version $ARGV[0].$REVNO-$BRANCH\n");
printf("}\n");

#printf "\\\\"
