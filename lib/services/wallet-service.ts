import prisma from "@/lib/prisma";

// Your 100 wallet addresses
const PLATFORM_WALLETS = [
  "0x476b90A9CF422a507A249225Ecb019355958d779",
  "0xe85A21a406F2fDCe0d78F509580b2E8745D4961D",
  "0x5f7C24726fA9FE91Ea7870629e2Bc4655285Ef22",
  "0x34493304c95BD1A27f984D6f053d7252752D649d",
  "0xD1FC3088D4239096f8ddF1411120CdAC497152a2",
  "0x58DA9377c05F7f891269e0D9e7feDD8A314e6D17",
  "0x2Cb3B364BaC9C1eB9153c5ab55CD946a26dcD181",
  "0x7E76040207D4336aFF779116530B99CA36FD475C",
  "0x74Cc3aE762c85AD60a4dd2d26697004C5719d118",
  "0x761eFcBff8eB08F1a8d869e11916d0C4D4758b00",
  "0x326fFc273EbCDAA04351E4bF06A6FA92D52CE86B",
  "0x442706f1905d845B9A17cd2a225491fAA4bF45E3",
  "0x780CeB27Cd0Ed625a840Dd7f94a45C9a526e0fc3",
  "0x276f7D10794Abb1F1EcDC0571789e06aCa47e324",
  "0x2760430b9C0Ba69f530F41670947958de41df96C",
  "0xAFdF9aeD90d1D4Ce61E9a4d489B86766Da53802f",
  "0x2BAc164c6260C423CE24D4D7fFcd4F70f8D91Fb6",
  "0x410a188dD5e21358D759056e3D5D7CA4438e8ed2",
  "0x6EAeB99E7CBEA407acBc2df04130A4eb8a18AcB0",
  "0x26Dc761b1cc982120B13F0947Ba9c9A3aDeeF990",
  "0xa2F20F80a7527FDB16d56709bFA5E45422E26976",
  "0x838831aBBf5d6A20B986B5F848c265f44B7FFAAd",
  "0xB16B70dd76F2C40b832DAAaF4f649e14A04abd20",
  "0xc402D2a6Dd58d4dfbF851657d4459719F6C37A01",
  "0x6b8f463f48619a580983832E8455cd82228D8953",
  "0x2E02e639385356A289AfB28f131E332aF5A4C97c",
  "0xA3B712Fbe7783624d7eC6f04Be4eE83db33b2cCE",
  "0x119F1BFb5A5F2EFA2eF1dd493CE4dfaeaD8D1Be0",
  "0x3fdF4540C2b02E82ae9375815181ad3B62763Dd2",
  "0x496C2ccE1Cd21dF388C48931eD8Ffcd243207B30",
  "0x381a2362F3612e8ac79256f4f9Bfcf424d3e9159",
  "0xAa5f1faF96486Cd8f96099926789080358be04ee",
  "0xdc628E9d2E44C40996AB4f4220BCd3678ad265aC",
  "0x9a3F0Ec93f61e347eD94b0428F97648EA1BFF3EB",
  "0x10b3A86ED973267619463dCb38fE68b6E1257d51",
  "0xbaC3356579e8582707d16324DEab16C535c29aB3",
  "0x5d22A7e517bDEfeA931e127Ea9C07755445a9CF7",
  "0xDc678884332F1078f6b841793c7261a8b6a2F849",
  "0xeCf367b14DBE536A293D1434fD51A3f9551FD1Ec",
  "0xeCf367b14DBE536A293D1434fD51A3f9551FD1Ec", // Duplicate address
  "0xf272B06E746D233e013839fD8A1E3c0965637356",
  "0xb01591F2398C2472d039dbeF6a27D3cDeE52d297",
  "0x7619B947e8f0c104fb7F0469F611587f93D7642c",
  "0x84A31ad536124336a7c1f2BE195a6E9f61670A62",
  "0xA03F3007b5F736bb4Bb8B2aFE8D967b68395CFd4",
  "0x54B3e00db12c294c025eD4227b8D06F43DE58321",
  "0xc62b669DC1C306b86669c16497d65F7CaA9A9E42",
  "0x106332BFA1Ff8d1533F787B9066A7b6E8f9ABF9F",
  "0x4F948Fd4C34F1f21cB7bc91B68Fc9F3Ab00cFC8C",
  "0xcD8eb9cbD78e2154024701D9f835F30a8B54f69F",
  "0xAfb652D4cE5eF7Ad7dFe2B4703Cc624e2e6BC97b",
  "0xA2a3dd618Bd07607739E0BBC084eDbD6d492D5D4",
  "0xb1E0E7C8F4dB888cE47EACd29891D5A40501132B",
  "0x9ED2b9388be92F8F1124b993f7539DD0Ffe7F3D1",
  "0x2cC312D25Db69A17f0cEd3e74c354a796A2843b4",
  "0xe8d987B238707ad2a5EF0dB04a21B13625F7d3D9",
  "0x5543686e936013Fb0e90f7A4D087e53697Efe68D",
  "0x6E0d3fa05B4ccc4733f72b7af1Aa6583Ee42f8bf",
  "0xE1bfdefCc9462A20D2A9A72fC8E3840814053250",
  "0xf738fD316358905386700a34A9F793FDDF529a75",
  "0x41eCFC9B1a7b487eF8dF554e5c687087D9750e0E",
  "0xA07f5C9deA4a4A6873dD705549983Ea30C34250c",
  "0x9128AE7eB1D817FFCeA682511634396877507ceB",
  "0x414b55f3D8909a12Ab0a28A0dFD94772d53BB0BB",
  "0x83db7Ad52f2eF6fc9b865f017ee219569b121c74",
  "0xE38e50f7653296FAa9aBEbD797055787225C366C",
  "0xC7AcbD779a9f1f8b806ae7ecCd713113B2f7d3CE",
  "0x3ba7a8687924eaF80f416ad57589a63ac35d1634",
  "0x591cDA58c540e2FEca5851EB9e60EA7Fe83Dbff3",
  "0x209f9b32D3F989D82CD3d34B3454D53f715d1825",
  "0x81024244DCCA12D0161DCDB8d4C69052dD682Caa",
  "0x9E02279a359F464a988222D0a8ebD218d278B8Eb",
  "0xD1113831F32e6c3bf272961e740189707e818a0A",
  "0x9ac1b58eb83931ab5b3886ec70337624517b5f4e",
  "0x11524e8aeebc8a5c4006e6e24ede857c9a094c08",
  "0x814f2FEB39F06F9f54AA8696748A98176E563330",
  "0xCca02aE821b0C74A916cF185fd6A32AF4B4806A7",
  "0x83594b7327e9fe38fd063ac8725824e7067b4f6b",
  "0xe22a4544493ea404ba336e9e3fb6983b9f0e7927",
  "0xD858b701D5902893F5e93f70780cD39a5247Ef47",
  "0x3a240ac643a3168dd6b79e18c2f7a963f02f59bd",
  "0x53C6072448e2101cCb0Bb2981f5E743cD66b643C",
  "0x1066f4322a08029c6d79495536ddf9f1b542001f",
  "0x1f4927aff8c47e797c7bcb0ae42ae8976beb944a",
  "0x86c5f2cc6c1eaf7129728da19606a346e831e479",
  "0x0749b08bb268e695910895a3531a8e4f1187bec8",
  "0xc3b528bfe1ca903519253e8dee81b37d6429e415",
  "0x9801627f47d5d335808afa2cafa26108dcd85ae0",
  "0x3c9889ea905a02ae27901f87130b515de0309f42",
  "0x15bd6de59b588ba7b47e250ef8c573aa058e9af2",
  "0x923b5052cfda5dc9bd4d8ec06caa51f302eb6a5a",
  "0xd45666390e973Fa19a1b0abAD6B1112857072AC3",
  "0xdbaa0e8fddd39e7e94aa09e9fda234a4c5644a80",
  "0x1fa7b708e710fd0fd36bac499711df00b118e4c2",
  "0x1f17e8ecb18cf52cd3e2f1ba96c6b305294c3b34",
  "0xde13758baa74563395432ac47f911f1e877e3153",
  "0xe5e70de2b5ad5944a9460685614e0e50be89d94a",
  "0x70A813405ea82e8236bf57666131e37f74775644",
  "0xbd27abf03f4b2c85800f3d7bf34306accf60cd76",
  "0x6c361396a79402b82d3092815172a47df9f2fa4e",
];

export class WalletService {
  // Initialize wallets in database (run once)
  static async initializeWallets() {
    try {
      for (let i = 0; i < PLATFORM_WALLETS.length; i++) {
        await prisma.platformWallet.upsert({
          where: { address: PLATFORM_WALLETS[i] },
          update: {},
          create: {
            address: PLATFORM_WALLETS[i],
            index: i + 1,
            status: "available",
          },
        });
      }
      console.log("Platform wallets initialized successfully");
    } catch (error) {
      console.error("Failed to initialize wallets:", error);
    }
  }

  // Assign a wallet to a user using round-robin logic
  static async assignWalletToUser(userId: string) {
    try {
      return prisma.$transaction(async (prisma) => {
        // Get total number of wallets
        const totalWallets = await prisma.platformWallet.count();

        // Get the number of users that already have wallets assigned
        const usersWithWallets = await prisma.user.count({
          where: { assignedWallet: { not: null } },
        });

        // Calculate which wallet to assign (round-robin)
        const walletIndex = (usersWithWallets % totalWallets) + 1;

        // Find the wallet by index
        const walletToAssign = await prisma.platformWallet.findFirst({
          where: { index: walletIndex },
        });

        if (!walletToAssign) {
          throw new Error("Wallet not found for assignment");
        }

        // Update the wallet status and assigned info
        const updatedWallet = await prisma.platformWallet.update({
          where: { id: walletToAssign.id },
          data: {
            status: "assigned",
            assignedAt: new Date(),
          },
        });

        // Update the user with the assigned wallet
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            assignedWallet: updatedWallet.address,
            walletAssignedAt: new Date(),
          },
        });

        return {
          wallet: updatedWallet,
          user: updatedUser,
        };
      });
    } catch (error) {
      console.error("Failed to assign wallet:", error);
      throw error;
    }
  }

  // Get user's assigned wallet
  static async getUserWallet(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        assignedWallet: true,
        walletAssignedAt: true,
        PlatformWallet: {
          select: {
            address: true,
            index: true,
            status: true,
            assignedAt: true,
          },
        },
      },
    });
  }

  // Release a wallet (when user deletes account, etc.)
  static async releaseWallet(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { assignedWallet: true },
      });

      if (!user?.assignedWallet) {
        return; // No wallet to release
      }

      await prisma.$transaction([
        prisma.platformWallet.updateMany({
          where: {
            address: user.assignedWallet,
          },
          data: {
            status: "available",
            assignedAt: null,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            assignedWallet: null,
            walletAssignedAt: null,
          },
        }),
      ]);
    } catch (error) {
      console.error("Failed to release wallet:", error);
      throw error;
    }
  }

  // Get wallet statistics
  static async getWalletStats() {
    const total = await prisma.platformWallet.count();
    const available = await prisma.platformWallet.count({
      where: { status: "available" },
    });
    const assigned = await prisma.platformWallet.count({
      where: { status: "assigned" },
    });

    // Get unique users with assigned wallets
    const uniqueUsersWithWallets = await prisma.user.count({
      where: { assignedWallet: { not: null } },
    });

    return {
      total,
      available,
      assigned,
      uniqueUsersWithWallets,
    };
  }

  // Get wallet assignment distribution
  static async getWalletDistribution() {
    const wallets = await prisma.platformWallet.findMany({
      orderBy: { index: "asc" },
    });

    return wallets.map((wallet) => ({
      index: wallet.index,
      address: wallet.address,
      status: wallet.status,
      assignedAt: wallet.assignedAt,
    }));
  }
}
