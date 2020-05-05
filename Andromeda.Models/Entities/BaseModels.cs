using System.Collections.Generic;

namespace Andromeda.Models.Entities
{
    ///<summary> Базовая модель получения сущности </summary>
    public abstract class BaseGetOptions
    {
        ///<summary> Ключ сущности </summary>
        public int? Id { get; set; }
        ///<summary> Ключи сущностей </summary>
        public IReadOnlyList<int> Ids { get; set; }
    }
}