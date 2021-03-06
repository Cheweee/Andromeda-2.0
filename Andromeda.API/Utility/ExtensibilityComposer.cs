using System;
using Andromeda.Services.GenerateLoadStrategies;
using Microsoft.Extensions.DependencyInjection;

namespace Andromeda.API.Utility
{
    public static class ExtensibilityComposer
    {
        public static IGenerateDepartmentLoad ComposeGenerateStrategies(this IServiceProvider provider)
        {
            return new GenerateCompositeStrategy(provider.GetServices<IGenerateStrategy>);
        }
    }
}