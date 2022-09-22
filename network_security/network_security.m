#!/usr/bin/env octave
M=200
N=60
E=60
nE=21


function retval = pE (E,M,n)
  retval = (E-n)/(M-n);
endfunction

function retval = pnE (E,M,N,nE)
         prod=1;
         NE=min(E,N)
         for i = 0:nE-1
             prod *= pE(E,M,i);
         end
         prod
         for i = nE:NE-1
             prod *= (1-pE(E,M,i));
         end
         prod
         nchoosek (N, nE)
         prod *=nchoosek (N, nE)
endfunction

#pE(E, M, nE)
pnE(E, M, N,nE)

#nchoosek (n, k)
