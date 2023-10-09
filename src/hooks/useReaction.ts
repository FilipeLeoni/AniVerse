// import { Reaction } from "@/@types";

const useReaction: any = (type: string) => {
  // return useSupabaseSingleQuery(
  //   ["reaction", type],
  //   () => {
  //     return supabaseClient
  //       .from<Reaction>("sce_reactions")
  //       .select("*")
  //       .eq("type", type)
  //       .single();
  //   },
  //   {
  //     staleTime: Infinity,
  //   }
  // );
};

export default useReaction;
