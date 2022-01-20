#!/usr/bin/env rdmd

import std.stdio;
import std.math;
import std.algorithm.comparison :min, max;

struct Attack {
    const uint M;
    const uint N;
    const uint E;
    double pE(const uint n) const nothrow {
        if (E>n) {
            return double(E-n)/double(M-n);
        }
        return double(0);
    }

    double pnE(const uint nE) const  {
        const NE=min(E, N);
        double result=1;
        const n=N;
        uint k=1;
        result*= pow(1-pE(nE), (NE-nE));
        //writefln("nE=%d result=%e", nE, result);
        foreach(i;1..max(N-nE,nE)) {
            //writefln("i=%d NE=%d nE=%d (N-nE)=%d", i, NE, nE, (N-nE));
            if (i <= nE) {
                result*= pE(i);
            }
            if (k<=(N-nE)) {
                //       writefln("k=%d", k);
                result *= double(k+1)/double(N-k);
                k++;
            }
        }
        return result;
    }
    double pn_nE(const uint nE) const {
        double result=0;
        foreach(i;nE..N) {
            result += pnE(i);
        }
        return result;
    }

    void estimate(const uint nE) {
        writefln("nE           =%d", nE);
        writefln("(E-nE/M)     =%e", double(E-nE)/double(M));
        writefln("(E-nE)/(M-nE)=%e", double(E-nE)/double(M-nE));
    }

}

int main(string[] args) {
    const M=1001;
    const N=101;
    const E=101;
    auto attack=Attack(M, N, E);
    const nE_1_3=N/3+1;
    const nE_2_3=N*2/3+1;
    attack.estimate(nE_1_3);
    attack.estimate(nE_2_3);
    writefln("Total  nodes M=%d", M);
    writefln("Active nodes N=%d", N);
    writefln("Evil   nodes E=%d", E);
    writefln("Attack 1/3 %e nE=%d",  attack.pn_nE(nE_1_3), nE_1_3);
    writefln("Attack 2/3 %e nE=%d",  attack.pn_nE(nE_2_3), nE_2_3);
    return 0;
}
