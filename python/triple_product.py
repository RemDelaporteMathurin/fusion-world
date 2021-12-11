import numpy as np


def get_DT_fusion_reactivity(T_ion):
    # the paper by Bosch contains data for more fusion reactions
    # here, we focus on DT-fusion only
    # reaction = 1 refers to T(d,n)4He
    reaction = 1

    if reaction == 1:
        b_G     = 34.3827
        mr_c2   = 1124656.
        c1      = 1.17302e-9
        c2      = 1.51361e-2
        c3      = 7.51886e-2
        c4      = 4.60643e-3
        c5      = 1.35000e-2
        c6      = -1.06750e-4
        c7      = 1.36600e-5

    theta = T_ion / ( 1. - T_ion*(c2+T_ion*(c4+T_ion*c6)) / (1.+T_ion*(c3+T_ion*(c5+T_ion*c7))) )
    chi   = ( b_G**2/(4.*theta) )**(1./3.)

    # reactivity as given in the paper in units of cm^3/s (with T_ion in keV)
    sigma_v = c1 * theta * np.sqrt( chi/(mr_c2*T_ion**3) ) * np.exp(-3.*chi)
    # scale to m^3/s
    sigma_v *= 1e-6

    return sigma_v


E = 3500  # MeV
T = np.logspace(0, 2)  # keV
sigma = get_DT_fusion_reactivity(T)
c_br = 1.04e-19
Z_eff = 1
triple_product_infty = 12/(E-4*c_br*Z_eff*np.sqrt(T))*T**2/sigma


def triple_product(Q):
    return triple_product_infty/(1+1/Q)


if __name__ == "__main__":
    data = []
    for x, y in zip(T, triple_product(1)/1e20):
        data.append([x, y])
    print(data)
