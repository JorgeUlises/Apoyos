using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace Acciones.Models
{
    public partial class Ciudadano
    {
        public Ciudadano()
        {
            AsistentesEventos = new HashSet<AsistentesEvento>();
            Beneficiarios = new HashSet<Beneficiario>();
            BeneficiariosGestion = new HashSet<BeneficiarioGestion>();
            IntegrantesAsociacions = new HashSet<IntegrantesAsociacion>();
            PersonasVisitada = new HashSet<PersonasVisitada>();
        }

        public int CiudadanoId { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string NombreCompleto { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Partido { get; set; }
        public string TipoMiembro { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        [DataType(DataType.Date)]
        public DateTime? FechaNacimiento { get; set; }
        public int? Estatus { get; set; }
        public string Genero { get; set; }
        public string Notas { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }
        public int? recordarcumple { get; set; }
        public int? DiputadoId { get; set; }
        public string RFC { get; set; }
        public string CURP { get; set; }
        public int? Afin { get; set; }
        public int? RCasilla { get; set; }
        public int? NoAfin { get; set; }
        public int? DDigital { get; set; }
        public string NombreArchivoBD { get; set; }
        public string URL { get; set; }

        public string ArchivoINE_BD { get; set; }
        public string INE_URL { get; set; }

        public int? MunicipioId { get; set; }
        public int? PartidoId { get; set; }
        public virtual Calle Calle { get; set; }
        public virtual Colonia Colonia { get; set; }
        public virtual ICollection<AsistentesEvento> AsistentesEventos { get; set; }
        public virtual ICollection<Beneficiario> Beneficiarios { get; set; }
        public virtual ICollection<BeneficiarioGestion> BeneficiariosGestion { get; set; }
        public virtual ICollection<IntegrantesAsociacion> IntegrantesAsociacions { get; set; }
        public virtual ICollection<PersonasVisitada> PersonasVisitada { get; set; }
    }
}
