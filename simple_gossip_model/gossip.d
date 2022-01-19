
import std.algorithm.iteration: each;
import std.bitmanip : BitArray;
import std.random;
import std.stdio;
import std.typecons;

struct Gossip {
    BitArray[] networks;
    const uint N;
    this(const uint N) {
        this.N = N;
        networks=new BitArray[N];
        networks
            .each!((ref n) => n.length=N);
        foreach(i, ref n; networks) {
            n[i]=true;
        }
    }

    auto epoch() {
        auto rnd = Random(unpredictableSeed);
        uint count;
        double bw=0.0;
        while (networks[0].count != N) {
            count++;
            foreach(i, ref n; networks) {
                uint to_i;
                do {
                    to_i = uniform(0, N, rnd);
                } while (i == to_i);
                bw+=(n - networks[to_i]).count;
                bw+=(networks[to_i]-n).count;
                n |= networks[to_i];
            }
        }
        return tuple!("strong","bw")(count,bw);
    }
}

int main(string[] args) {
    foreach(N;[11,31,101,1001,10_001,100_001]) {
        auto gossip=Gossip(N);
        const result=gossip.epoch;
        writefln("gossip [N=%6d strong=%3d bw=%11.0f]", N, result.strong, result.bw);
    }
    return 0;
}
