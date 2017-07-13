const bindAll = (ctx, methods) => {
    methods.forEach((m) => { ctx[m] = ctx[m].bind(ctx); });
};

export default bindAll;
