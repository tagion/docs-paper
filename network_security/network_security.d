#!/usr/bin/env rdmd

import std.stdio;
import std.math;
import std.algorithm.comparison :min;

struct Attack {
    const uint M;
    const uint N;
    const uint E;
    double pE(const uint n) const nothrow {
        return double(E-n)/double(M-n);
    }

    double pnE(const uint nE) const  {
        const NE=min(E, N);
        double result;
        const n=N;
        uint k=1;
        const _pE=pE(nE);
        result = pow(_pE, nE);
        result*= pow((1-_pE), (NE-nE));

        foreach(i;0..NE) {
            if (k<=(N-nE)) {
                result *= double(k+1)/double(N-k);
                k++;
            }
        }
        return result;
    }
    double pn_nE(const uint nE) const {
        double result=0;
        uint k=1;
        foreach(i;nE..N) {
            result += pnE(i);
        }
        return result;
    }

    void estimate(const uint nE) {
        writefln("nE           =%d", nE);
        writefln("(E/M)        =%e", double(E)/double(M));
        writefln("(E-nE)/(M-nE)=%e", double(E-nE)/double(M-nE));
    }

}

int main(string[] args) {
//    const nE=double(10);
    const M=1001;
    const N=101;
    const E=101;
    auto attack=Attack(M, N, E);
    const nE_1_3=N/3+1;
    const nE_2_3=N*2/3+1;
    attack.estimate(nE_1_3);
    attack.estimate(nE_2_3);
// //    writefln("%s",  Security.comb(100,50));
//     writefln("(E/M)=%e (E-nE)/M-nE)=%s", double(E)/double(M),
//         double(E)/double(M),
//         attack.
    // writefln("%e",  attack.pE(21));
    // writefln("%e",  attack.pnE(21));
    writefln("Total  nodes M=%d", M);
    writefln("Active nodes N=%d", N);
    writefln("Evil   nodes E=%d", E);
    writefln("Attack 1/3 %e nE=%d",  attack.pn_nE(nE_1_3), nE_1_3);
    writefln("Attack 2/3 %e nE=%d",  attack.pn_nE(nE_2_3), nE_2_3);
    return 0;
}
