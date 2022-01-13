using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;

using System.Data;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Acciones.Controllers
{
    public class EventoesController : Controller
    {
        private readonly dbAccionesContext _context;

        public EventoesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Eventoes
        public async Task<IActionResult> Index()
        {
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegBusqueda"] = LLegis;

            var dbAccionesContext = _context.Eventos;
            ViewBag.JavaScriptFunction = string.Format("FiltraEventos();");
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Eventoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var evento = await _context.Eventos
                .Include(e => e.Calle)
                .Include(e => e.Colonia)
                .Include(e => e.Diputado)
                .Include(e => e.Legislatura)
                .FirstOrDefaultAsync(m => m.EventoId == id);
            if (evento == null)
            {
                return NotFound();
            }

            return View(evento);
        }

        // GET: Eventoes/Create
        public IActionResult Create()
        {
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            //ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre");

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegEventoNvoReg"] = LLegis;

            return View();
        }

        // POST: Eventoes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EventoId,LegislaturaId,DiputadoId,Fecha,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,NumAsistentes,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Evento evento)
        {
            if (ModelState.IsValid)
            {
                _context.Add(evento);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);
            return View(evento);
        }

        // GET: Eventoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);
            return View(evento);
        }

        // POST: Eventoes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EventoId,LegislaturaId,DiputadoId,Fecha,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,NumAsistentes,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Evento evento)
        {
            if (id != evento.EventoId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(evento);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventoExists(evento.EventoId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);
            return View(evento);
        }

        // GET: Eventoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var evento = await _context.Eventos
                .Include(e => e.Calle)
                .Include(e => e.Colonia)
                .Include(e => e.Diputado)
                .Include(e => e.Legislatura)
                .FirstOrDefaultAsync(m => m.EventoId == id);
            if (evento == null)
            {
                return NotFound();
            }

            return View(evento);
        }

        // POST: Eventoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EventoExists(int id)
        {
            return _context.Eventos.Any(e => e.EventoId == id);
        }



        /************************************************************
            Obtiene Todas los EVENTOS
        *************************************************************/
        public IEnumerable<ObjetoEventos> ObtieneEventos(int RegXpag, int offsetPeticiones, int LegislaturaID, string folio, string descripcion, string tipoId, int estatusId, string fechaInicioEvento, string fechaFinEvento, string colonia)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoEventos> ListaObjetos = new List<ObjetoEventos>();
            ListaObjetos = (IEnumerable<ObjetoEventos>)(
                    from eventos in _context.Eventos.Where(eve => eve.LegislaturaId == LegislaturaID && eve.DiputadoId == diputadoId)
                    join colonias in _context.Colonias on eventos.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on eventos.CalleId equals calles.CalleId
                    join legislatura in _context.Legislaturas on eventos.LegislaturaId equals legislatura.LegislaturaId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : eventos.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(colonia) ? (true) : colonias.NombreColonia.Contains(colonia)
                    where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(tipoId) ? (true) : eventos.Tipo.Contains(tipoId) 
                    where true && (estatusId < 0) ? (true) : eventos.Estatus == estatusId
                    where true && (fechaInicioEvento == "0" && fechaFinEvento == "0") ? (true) : _context.Eventos.Where(e => e.Fecha >= DateTime.ParseExact(fechaInicioEvento, "dd-MM-yyyy HH:mm", null) && e.Fecha <= DateTime.ParseExact(fechaFinEvento, "dd-MM-yyyy HH:mm", null)).Select(e => e.EventoId).Contains(eventos.EventoId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending
                    orderby eventos.Fecha descending

                    select new ObjetoEventos
                    {
                        EventoId = eventos.EventoId,
                        LegislaturaId = (int)eventos.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = eventos.Folio,
                        Descripcion = eventos.Descripcion,
                        Tipo = eventos.Tipo,
                        NumeroAsistentes = (int)eventos.NumAsistentes,
                        Colonia = colonias.NombreColonia,
                        Calle = calles.NombreCalle,
                        NumeroExterior = eventos.NumExterior,
                        NumeroInterior = eventos.NumInterior,
                        Latitud = eventos.Latitud,
                        Longitud = eventos.Longitud,
                        CP = (int)eventos.Cp,
                        EstatusId = (int)eventos.Estatus,
                        Fecha = eventos.Fecha != null ? ((DateTime)eventos.Fecha).ToShortDateString() : "",
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroEventosXfiltro(int LegislaturaID, string folio, string descripcion, string tipoId, int estatusId, string fechaInicioEvento, string fechaFinEvento, string colonia)
        {
            int diputadoId = 8;
            var results =
                        from eventos in _context.Eventos.Where(eve => eve.LegislaturaId == LegislaturaID && eve.DiputadoId == diputadoId)
                        join colonias in _context.Colonias on eventos.ColoniaId equals colonias.ColoniaId
                        join calles in _context.Calles on eventos.CalleId equals calles.CalleId
                        join legislatura in _context.Legislaturas on eventos.LegislaturaId equals legislatura.LegislaturaId

                        //where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                        where true && String.IsNullOrEmpty(descripcion) ? (true) : eventos.Descripcion.Contains(descripcion)
                        where true && String.IsNullOrEmpty(colonia) ? (true) : colonias.NombreColonia.Contains(colonia)
                        where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                        where true && String.IsNullOrEmpty(tipoId) ? (true) : eventos.Tipo.Contains(tipoId)
                        where true && (estatusId < 0) ? (true) : eventos.Estatus == estatusId
                        where true && (fechaInicioEvento == "0" && fechaFinEvento == "0") ? (true) : _context.Eventos.Where(e => e.Fecha >= DateTime.ParseExact(fechaInicioEvento, "dd-MM-yyyy HH:mm", null) && e.Fecha <= DateTime.ParseExact(fechaFinEvento, "dd-MM-yyyy HH:mm", null)).Select(e => e.EventoId).Contains(eventos.EventoId)

                        //orderby Convert.ToInt32(peticiones.Folio) descending

                        select eventos.EventoId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventos(int LegislaturaID)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaID + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /************************************************************
            Nuevo Evento
        *************************************************************/
        [HttpPost]
        public int NuevoEvento(int legislaturaId, string folioEvento, int estatusId, int numAsistentes, string fechaEvento, string tipoEvento, int coloniaId, int calleId, string numExt, string numInt, int CP, string latitud, string longitud, string descripcionEvento)
        {
            Evento evento = new Evento
            {
                LegislaturaId = legislaturaId,
                Folio = folioEvento,
                Estatus = estatusId,
                NumAsistentes = numAsistentes,
                Fecha = fechaEvento == null || fechaEvento == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaEvento + " 00:00:00"),
                Tipo = tipoEvento ?? "",
                ColoniaId = coloniaId,
                CalleId = calleId,
                NumExterior = numExt ?? "",
                NumInterior = numInt ?? "",
                Cp = CP,
                Latitud = latitud ?? "",
                Longitud = longitud ?? "",
                Descripcion = descripcionEvento,
                Campo1 = "",
                Campo2 = 0,

                DiputadoId = 8,
                Distrito = "V",
                Seccion = "",
                FechaRegistro = DateTime.Now,
                FechaUltimoCambio = DateTime.Now,
                UsuarioRegistro = 1
            };


            try
            {
                _context.Add(evento);
                _context.SaveChanges();

                if (evento.EventoId != 0)
                {
                    return evento.EventoId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el Evento");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar el Evento: {0}", e.Message);
                return -2;
            }
        }


        /*******************************************************************
            Obtiene Resumen de Eventos X Tipo X Estatus
        ********************************************************************/
        [HttpGet]
        public List<ObjetoEventoTipoEstatus> resumenXtipo(int LegislaturaID)
        {
            List<ObjetoEventoTipoEstatus> ListaObjetos = new List<ObjetoEventoTipoEstatus>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenEventosXtipoXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaID;

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEventoTipoEstatus obj = new ObjetoEventoTipoEstatus();
                    obj.Tipo = query.GetString(0);
                    obj.SinEstatus = query.GetInt32(1);
                    obj.Planeado = query.GetInt32(2);
                    obj.Realizado = query.GetInt32(3);
                    obj.Pospuesto = query.GetInt32(4);
                    obj.Cancelado = query.GetInt32(5);
                    obj.Total = query.GetInt32(1) + query.GetInt32(2) + query.GetInt32(3) + query.GetInt32(4) + query.GetInt32(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /************************************************************
            Busca si existe un Número de Folio
        *************************************************************/
        public int BuscaNumeroFolio(string folio)
        {
            var TotalRegistrosEncontrados = _context.Eventos.Where(p => p.Folio == folio).Count();
            return TotalRegistrosEncontrados;
        }


        /****************************************************************************
            Obtiene Lista de Archivos de un Evento
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivosEvento> ObtieneListaArchivosEvento(int idEvento)
        {
            List<ObjetoArchivosEvento> ListaObjetos = new List<ObjetoArchivosEvento>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDeEventos";
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivosEvento obj = new ObjetoArchivosEvento();
                    obj.EventoID = query.GetInt32(0);
                    obj.NombreArchivo = query.GetString(1);
                    obj.URL = query.GetString(2);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
                    Subir Archivos Anexos de un Evento
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoEvento(List<IFormFile> files, int EventoId)
        {
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    //subPath = numeroTurno;
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    nombreArchivoBD = Convert.ToString(EventoId) + "_" + numeroArchivosXeventoId(EventoId) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\EVENTOS\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        var URL = "/Archivos/PETICIONES/EVENTOS/" + nombreArchivoBD;

                        GuardaReferenciaArchivoEventoBD(nombreArchivo, nombreArchivoBD, URL, EventoId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = serverMessage });
        }

        /*******************************************************************
            Obtiene el número de Archivos Peticion ID 
        ********************************************************************/
        public Int32 numeroArchivosXeventoId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosEventos] WHERE EventoID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Guarda Referencia de Archivos INICIATIVA en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoEventoBD(string NombreArchivo, string NombreArchivoBD, string URL, int EventoId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoEventos";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@EventoId", System.Data.SqlDbType.Int).Value = EventoId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;

            try
            {
                SqlDataReader query = cmd.ExecuteReader();
                conn.Close();

                return "OK";
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return "NO";
            }
        }

        public partial class ObjetoEventoTipoEstatus
        {
            public string Tipo { get; set; }
            public int SinEstatus { get; set; }
            public int Planeado { get; set; }
            public int Realizado { get; set; }
            public int Pospuesto { get; set; }
            public int Cancelado { get; set; }
            public int Total { get; set; }
        }

        public partial class ObjetoArchivosEvento
        {
            public int EventoID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
        }

    }
}
