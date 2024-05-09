#include <emscripten/bind.h>
#include <optional>
#include "Core/RNG/LCRNG.hpp"
#include "Core/RNG/MTFast.hpp"
using namespace emscripten;

using MRNG = LCRNG<0x3039, 0x41C64E6D>;
using MRNGR = LCRNG<0xFC77A683, 0xEEB9EB65>;

std::optional<u32> find_group_seed(u16 lotto1, u16 lotto2, u16 lotto3)
{
    u32 lotto1_seed = lotto1 << 16;
    for (int i = 0; i < 0x10000; i++, lotto1_seed++)
    {
        // lotto logic:
        // group_rng = ARNG(...)
        // lotto1 = MRNG(group_rng).nextUShort()
        // group_rng.next()
        // lotto2 = MRNG(group_rng).nextUShort()
        // group_rng.next()
        // lotto3 = MRNG(group_rng).nextUShort()

        // nested LCRNGs can technically be combined!
        u32 init = MRNGR(lotto1_seed).next();
        auto group_rng = ARNG(init);
        group_rng.next();
        u16 test_lotto2 = MRNG(group_rng).nextUShort();
        if (lotto2 != test_lotto2)
            continue;
        group_rng.next();
        u16 test_lotto3 = MRNG(group_rng).nextUShort();
        if (lotto3 != test_lotto3)
            continue;
        return init;
    }
    return std::nullopt;
}

void find_sid_results(u16 tid, u32 group_seed, u8 day, u8 month, u32 delay_min, u32 delay_max, u32 max_advances, emscripten::val update_callback, emscripten::val result_callback)
{
    u32 progress = 0;
    for (u32 delay = delay_min; delay < delay_max; delay++)
    {
        u32 seed_high = (day * month) << 24;
        for (int min_sec = 0; min_sec < 60 + 60; min_sec++, seed_high += 1 << 24)
        {
            for (u32 seed_hour = 0; seed_hour < (24 << 16); seed_hour += 1 << 16)
            {
                progress++;
                if ((progress & 0xFFFF) == 0)
                {
                    update_callback.call<void>("call", 0, progress);
                }
                u32 seed = (seed_high | seed_hour) + delay;
                MTFast<2> mt(seed, 0);
                if (ARNGR::distance(group_seed, mt.next()) >= max_advances)
                    continue;
                u32 tidsid = mt.next();
                if ((tidsid & 0xFFFF) != tid)
                    continue;
                auto result = emscripten::val::array();
                result.call<void>("push", seed);
                result.call<void>("push", tidsid >> 16);
                result_callback.call<void>("call", 0, result);
            }
        }
    }
}

EMSCRIPTEN_BINDINGS(my_module)
{
    register_optional<u32>();
    function("find_group_seed", &find_group_seed);
    function("find_sid_results", &find_sid_results);
}