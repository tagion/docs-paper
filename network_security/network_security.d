#!/usr/bin/env rdmd

import std.stdio;
import std.math;
import std.algorithm.comparison :min, max;

struct Attack {
    const uint M;
    const uint N;
    const uint E;
    double pE(const uint n) const nothrow pure {
        if (E>n) {
            return double(E-n)/double(M-n);
        }
        return double(0);
    }

    double pG(const uint n, const uint e) const nothrow pure {
        assert(e<=E);
//        return double(M-(E-e)-n)/double(M-n);
        return 1-double(E-e)/double(M-n);
    }

    double pnE(const uint nE) const  {
        const NE=min(E, N);
        double result=1;
        // writefln("#### nE=%d", nE);
        // return pE(nE);
        // //const n=N;
        // //uint k=1;
        // //result = pow(1-pE(nE), (N-nE));
        // //writefln("nE=%d result=%e", nE, result);
        foreach(i;0..nE) {
            result*= pE(i);
            // writefln("  %d result=%e", i, result);
        }
        foreach(i;nE..N+1) {
            result*= pG(i, nE);
            // writefln("->%d result=%e", i, result);
        }

        // writefln("pE0=%e nE=%d pE0=%e", pE(0), nE, double(E)/double(M));
//        result=pow(pE(nE),nE);
//        result=pow(1-pE(0),NE-1-nE);
        // return result;
        // assert(0);
         // double P=1;
         // double Q=1;
         //writefln("     r=%e", result);

        foreach(k;1..(N-nE)+1) {
            // P*=(nE+k);
            // Q*=k;
            // writefln("k=%d %s", k, [P,Q]);
            result *= double(nE+k)/double(k);
        }
        // writefln("P=%s Q=%s %s", P,Q, P/Q);
//        result *= (P/Q);
//        writefln("P=%s Q=%s", P,Q);
        //writefln("result=%e", result);
        return result;
    }
    double pn_nE(const uint nE) const {
        double result=0;
        foreach(i;nE..N) {
            //writef(">>i=%d ",i);
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
    const M=201;
    const N=31;
    const E=31;
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
    // writefln("Attack 1/3 pE=%e nE=%d",  attack.pnE(4), nE_1_3);
    return 0;
}
