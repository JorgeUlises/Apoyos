using System;
using System.Collections.Generic;

#nullable disable

namespace Acciones.Models
{
    public partial class Dependencia
    {
        public Dependencia()
        {
            Bitacoras = new HashSet<Bitacora>();
            Peticiones = new HashSet<Peticione>();
        }

        public int DependenciaId { get; set; }
        public string NombreDependecia { get; set; }
        public string Descripcion { get; set; }
        public string NombreContacto { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public int? Estatus { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }

        public virtual Calle Calle { get; set; }
        public virtual Colonia Colonia { get; set; }
        public virtual ICollection<Bitacora> Bitacoras { get; set; }
        public virtual ICollection<Peticione> Peticiones { get; set; }
    }
}
